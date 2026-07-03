# scripts/verify_db_connection.py
import sys
import os
import asyncio

async def test_db_pools():
    print("Testing active connections to MongoDB, Redis, and Qdrant...")
    sys.path.insert(0, os.path.abspath("backend"))
    
    from app.core.database import init_mongodb, init_redis, init_qdrant, close_connections
    
    errors = []
    
    # 1. MongoDB Connection Test
    try:
        await init_mongodb()
        print("[OK] MongoDB connection & Beanie initialization check passed.")
    except Exception as e:
        errors.append(f"MongoDB connection failed: {str(e)}")
        
    # 2. Redis Connection Test
    try:
        await init_redis()
        print("[OK] Redis connection & ping check passed.")
    except Exception as e:
        errors.append(f"Redis connection failed: {str(e)}")
        
    # 3. Qdrant Connection Test
    try:
        await init_qdrant()
        print("[OK] Qdrant client check completed.")
    except Exception as e:
        errors.append(f"Qdrant connection failed: {str(e)}")
        
    # Close connection pools
    await close_connections()
    
    if errors:
        print("\n[WARNING] Some databases are currently unreachable:")
        for error in errors:
            print(f"- {error}")
        print("\nNote: Make sure your local MongoDB, Redis, and Qdrant services are active or containerized before boot.")
    else:
        print("\nALL DATABASE CONNECTIONS AUDITS COMPLETED!")

if __name__ == "__main__":
    asyncio.run(test_db_pools())
