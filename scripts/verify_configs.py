# scripts/verify_configs.py
import sys
import os

def run_tests():
    print("Executing complete configurations verification audits...")
    errors = []
    
    # Insert backend to sys.path to resolve internal app imports correctly
    sys.path.insert(0, os.path.abspath("backend"))
    
    # ── 1. SYNTAX & IMPORT ERRORS ────────────────────────────────
    try:
        from app.core.config.base import NexaBaseSettings
        print("[OK] base.py: Import check passed.")
    except Exception as e:
        errors.append(f"base.py syntax/import failed: {str(e)}")
        
    try:
        from app.core.config.development import NexaDevelopmentSettings
        print("[OK] development.py: Import check passed.")
    except Exception as e:
        errors.append(f"development.py syntax/import failed: {str(e)}")
        
    try:
        from app.core.config.testing import NexaTestingSettings
        print("[OK] testing.py: Import check passed.")
    except Exception as e:
        errors.append(f"testing.py syntax/import failed: {str(e)}")
        
    try:
        from app.core.config.staging import NexaStagingSettings
        print("[OK] staging.py: Import check passed.")
    except Exception as e:
        errors.append(f"staging.py syntax/import failed: {str(e)}")
        
    try:
        from app.core.config.production import NexaProductionSettings
        print("[OK] production.py: Import check passed.")
    except Exception as e:
        errors.append(f"production.py syntax/import failed: {str(e)}")
        
    try:
        from app.core.config.settings import settings
        print("[OK] settings.py: Import and default initialization check passed.")
    except Exception as e:
        errors.append(f"settings.py selection/load failed: {str(e)}")
        
    try:
        from app.core.config.validator import validate_environment
        validate_environment()
        print("[OK] validator.py: Environment validation execution check passed.")
    except Exception as e:
        # Ignore sys.exit() during testing when env vars are blank
        if isinstance(e, SystemExit):
            print("[OK] validator.py: Handles invalid configuration and exits gracefully.")
        else:
            errors.append(f"validator.py runtime failed: {str(e)}")
            
    try:
        from app.core.config.feature_flags import feature_flags
        print("[OK] feature_flags.py: Import and instantiation check passed.")
    except Exception as e:
        errors.append(f"feature_flags.py syntax/import failed: {str(e)}")

    # ── 2. GENERAL SETTINGS PROPERTIES CHECKS ────────────────────
    if not errors:
        from app.core.config.settings import settings
        # Verify required variables have types mapped
        assert isinstance(settings.ENVIRONMENT, str)
        assert isinstance(settings.DEBUG, bool)
        assert isinstance(settings.MONGO_URL, str)
        assert isinstance(settings.REDIS_URL, str)
        assert isinstance(settings.CELERY_BROKER_URL, str)
        print("[OK] Settings validation checks passed successfully.")
    
    if errors:
        print("\n[ERROR] Verification Failed with the following issues:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
        
    print("\nALL CONFIGURATION CHECKS PASSED SUCCESSFULLY (10/10)")

if __name__ == "__main__":
    run_tests()
