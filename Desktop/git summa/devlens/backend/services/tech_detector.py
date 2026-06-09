from services.github_service import get_file_content

TECH_MAP = {
    "requirements.txt": {
        "tensorflow": "TensorFlow", "torch": "PyTorch", "flask": "Flask",
        "fastapi": "FastAPI", "django": "Django", "opencv": "OpenCV",
        "pandas": "Pandas", "numpy": "NumPy", "sklearn": "Scikit-learn",
        "transformers": "HuggingFace Transformers", "sqlalchemy": "SQLAlchemy",
        "celery": "Celery", "redis": "Redis", "pymongo": "MongoDB"
    },
    "package.json": {
        "react": "React", "vue": "Vue.js", "next": "Next.js", "express": "Express.js",
        "typescript": "TypeScript", "tailwindcss": "Tailwind CSS",
        "prisma": "Prisma", "mongoose": "MongoDB", "socket.io": "Socket.IO"
    },
    "pom.xml": {
        "spring-boot": "Spring Boot", "hibernate": "Hibernate", "junit": "JUnit"
    }
}

README_HINTS = {
    "docker": "Docker", "kubernetes": "Kubernetes", "aws": "AWS",
    "graphql": "GraphQL", "postgresql": "PostgreSQL", "mysql": "MySQL",
    "nginx": "Nginx", "redis": "Redis", "elasticsearch": "Elasticsearch",
    "microservices": "Microservices", "rest api": "REST API", "grpc": "gRPC"
}

async def detect_technologies(owner: str, repo: str, files: list, readme: str, topics: list = None, languages: dict = None) -> list:
    """Detect technologies used in a repository. Also use topics and languages as hints."""
    detected = set()
    topics = topics or []
    languages = languages or {}
    
    # Detect from dependency files
    for filename, tech_dict in TECH_MAP.items():
        if filename in files:
            try:
                content = await get_file_content(owner, repo, filename)
                content_lower = content.lower()
                for keyword, tech_name in tech_dict.items():
                    if keyword in content_lower:
                        detected.add(tech_name)
            except Exception as e:
                print(f"Error detecting tech in {filename}: {e}")
    
    # Detect from README keywords
    readme_lower = (readme or "").lower()
    for keyword, tech in README_HINTS.items():
        if keyword in readme_lower:
            detected.add(tech)

    # Map topics to technology hints
    TOPIC_TO_TECH = {
        "machine-learning": "Machine Learning",
        "deep-learning": "Deep Learning",
        "computer-vision": "Computer Vision",
        "nlp": "Natural Language Processing",
        "docker": "Docker",
        "kubernetes": "Kubernetes",
        "react": "React",
        "nodejs": "Node.js",
        "tensorflow": "TensorFlow",
        "pytorch": "PyTorch",
    }
    for t in topics:
        key = t.lower()
        if key in TOPIC_TO_TECH:
            detected.add(TOPIC_TO_TECH[key])

    # Add language names as detected technologies
    for lang in languages.keys():
        if lang:
            detected.add(lang)

    # Ensure at least something is present
    if not detected:
        # If topics present, include them
        for t in topics:
            detected.add(t)

    return sorted(list(detected))
