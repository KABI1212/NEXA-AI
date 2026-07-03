# scripts/generate_skeletons.py
import os

SKELETONS = {
    # ── VERTICAL SLICE BUSINESS MODULES ──────────────────
    "backend/app/modules/identity": {
        "purpose": "User management, credential controls, registrations, session tokens, and identity verifications.",
        "expected_files": [
            "router.py (FastAPI route routing parameters)",
            "service.py (Password hashes, token issuance logic)",
            "repository.py (Users & Sessions collections CRUD lookups)",
            "schemas.py (Login, register payloads validation)",
            "models.py (Beanie User and Session document definitions)",
            "exceptions.py (Auth failures definitions)"
        ],
        "responsibilities": "Securely authenticate logins, rotate JWT tokens, and store credentials.",
        "dependencies": ["app.shared", "app.core.security", "passlib", "jwt"]
    },
    "backend/app/modules/career": {
        "purpose": "Student career goals, skill gap audits, and roadmap generations.",
        "expected_files": [
            "router.py (Goals & roadmaps endpoints router)",
            "service.py (Orchestrates goals calculations and roadmap generation steps)",
            "repository.py (Goals & roadmap collections lookups)",
            "schemas.py (Match response payloads definitions)",
            "models.py (Beanie CareerGoal and Skill document definitions)"
        ],
        "responsibilities": "Generate roadmaps, calculate match levels, and audit skill gaps.",
        "dependencies": ["app.shared", "app.ai_os"]
    },
    "backend/app/modules/resume": {
        "purpose": "Resume parsed PDF extraction, keyword audits, and ATS suggestions.",
        "expected_files": [
            "router.py (Uploader and optimizer endpoints)",
            "service.py (Orchestrates PDF blocks parsing and ATS grading)",
            "models.py (Beanie Resume and ATSReport document definitions)"
        ],
        "responsibilities": "Parse PDF sections, calculate ATS scores, and rewrite description bullet points.",
        "dependencies": ["app.shared", "pdfplumber", "app.ai_os"]
    },
    "backend/app/modules/learning": {
        "purpose": "Courses catalog, lessons, adaptive quizzes, and certificate issuances.",
        "expected_files": [
            "router.py (Courses & quiz submissions router)",
            "service.py (Calculates LMS progress scores and builds certificate verification records)",
            "models.py (Beanie Course, Lesson, and Certificate document definitions)"
        ],
        "responsibilities": "Grade quiz questions, track user streaks, and generate verified certificate PDFs.",
        "dependencies": ["app.shared", "app.core.database", "reportlab"]
    },
    "backend/app/modules/interview": {
        "purpose": "STAR-based mock interviews and performance feedback.",
        "expected_files": [
            "router.py (Interview session setup endpoints)",
            "service.py (Evaluates behavioral responses against STAR targets)",
            "models.py (Beanie InterviewSession document definitions)"
        ],
        "responsibilities": "Grade behavioral responses and generate mock performance reports.",
        "dependencies": ["app.shared", "app.ai_os"]
    },
    "backend/app/modules/coding": {
        "purpose": "Coding lab workspaces and isolated compilers compiler runs.",
        "expected_files": [
            "router.py (Sandbox run execution endpoint hooks)",
            "service.py (Orchestrates container compiling and runtime monitor threads)",
            "models.py (Beanie CodingSubmission document definitions)"
        ],
        "responsibilities": "Compile user code safely inside isolated containers and enforce resource limits.",
        "dependencies": ["app.shared", "docker"]
    },
    "backend/app/modules/analytics": {
        "purpose": "Dashboard statistics and progress updates.",
        "expected_files": [
            "router.py (Stat cards metrics routers)",
            "service.py (Aggregates performance scores across LMS and compiler modules)"
        ],
        "responsibilities": "Provide data targets for dashboard charts.",
        "dependencies": ["app.shared", "app.core.database"]
    },
    # ── AI OPERATING SYSTEM (AI-OS) ──────────────────
    "backend/app/ai_os/gateway": {
        "purpose": "Redacts PII and publishes streaming tokens.",
        "expected_files": ["anonymizer.py (PII filters)", "streaming.py (Redis publishers)"],
        "responsibilities": "Scrub user inputs and stream tokens in real time.",
        "dependencies": ["redis", "re"]
    },
    "backend/app/ai_os/providers": {
        "purpose": "LLM client configuration and failovers.",
        "expected_files": ["manager.py (Client selector client)"],
        "responsibilities": "Configure LLM clients and handle failover routing.",
        "dependencies": ["openai", "google-genai", "anthropic"]
    },
    "backend/app/ai_os/registry": {
        "purpose": "Agent class registration.",
        "expected_files": ["registry.py (Dynamic Agent registration management)"],
        "responsibilities": "Register and load agent classes based on required capabilities.",
        "dependencies": []
    },
    "backend/app/ai_os/graph": {
        "purpose": "LangGraph state graph initialization.",
        "expected_files": ["graph.py (Initializes the main state graph)"],
        "responsibilities": "Define nodes, execution edges, and compiled runtimes.",
        "dependencies": ["langgraph"]
    },
    "backend/app/ai_os/memory": {
        "purpose": "Active conversation memory management.",
        "expected_files": ["memory_service.py (Redis active log helper)"],
        "responsibilities": "Summarize long threads and load user preferences.",
        "dependencies": ["redis"]
    },
    "backend/app/ai_os/rag": {
        "purpose": "Vector document search.",
        "expected_files": ["search.py (Similarity query client for Qdrant)"],
        "responsibilities": "Search vector indexes, filter by permissions, and format citations.",
        "dependencies": ["qdrant-client"]
    },
    # ── SHARED KERNEL ──────────────────────────────────
    "backend/app/shared/base": {
        "purpose": "Generic base classes for layers and documents.",
        "expected_files": ["document.py (Beanie NexaBaseDocument parent class)", "repository.py (Generic base Repository class)"],
        "responsibilities": "Enforce base audit fields and soft-delete features.",
        "dependencies": ["beanie"]
    },
    "backend/app/shared/errors": {
        "purpose": "System error codes configuration.",
        "expected_files": ["codes.py (Auth and validation error definitions)"],
        "responsibilities": "Standardize error handling across services.",
        "dependencies": []
    },
    # ── INFRASTRUCTURE DEPLOYMENT ──────────────────────
    "infrastructure/docker": {
        "purpose": "Docker Compose configurations for backend and databases.",
        "expected_files": ["docker-compose.dev.yml (Local database ports mapping)", "docker-compose.prod.yml (Nginx + production stacks config)"],
        "responsibilities": "Configure database compose ports and orchestrate production containers.",
        "dependencies": []
    },
    "infrastructure/monitoring/grafana": {
        "purpose": "Dashboard visualization configurations.",
        "expected_files": ["provisioning/dashboards/nexa_dashboard.yaml"],
        "responsibilities": "Define system performance dashboard visualizations.",
        "dependencies": []
    }
}

def generate_skeleton_readmes():
    print("Generating refactored project directory README files...")
    for path, spec in SKELETONS.items():
        if not os.path.exists(path):
            os.makedirs(path, exist_ok=True)
        
        readme_path = os.path.join(path, "README.md")
        
        content = f"""# NEXA AI Directory Specification: `{path}`

## 1. Purpose
{spec['purpose']}

## 2. Expected Files
"""
        for file in spec['expected_files']:
            content += f"- `{file}`\n"
            
        content += f"""
## 3. Responsibilities
{spec['responsibilities']}

## 4. Dependencies
"""
        if spec['dependencies']:
            for dep in spec['dependencies']:
                content += f"- `{dep}`\n"
        else:
            content += "- None\n"
            
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"Generated specifications file: {readme_path}")
        
    print("Refactored project directory skeletons successfully generated!")

if __name__ == "__main__":
    generate_skeleton_readmes()
