export const defaultCourses = [
  {
    title: "Full Stack Web Development",
    slug: "full-stack-web-development",
    instructor: "Prof. Rahul Sharma",
    category: "Web Development",
    level: "Beginner to Advanced",
    price: 0,
    premium: false,
    description: "Master React, Node.js, Express, MongoDB, deployment, interviews, and portfolio projects.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    modules: [
      { title: "HTML & CSS Fundamentals", duration: "52m", videoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU", assignment: "Build a responsive landing page" },
      { title: "JavaScript Essentials", duration: "1h 10m", videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk", assignment: "Build a to-do app" },
      { title: "React & Component Architecture", duration: "1h 20m", videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8", assignment: "Build a dashboard UI" },
      { title: "Node.js & Express APIs", duration: "1h 35m", videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE", assignment: "Create REST API with auth" },
      { title: "MongoDB & Databases", duration: "55m", videoUrl: "https://www.youtube.com/embed/c2M-rlkkT5o", assignment: "Design a database schema" },
      { title: "Deployment & Portfolio", duration: "48m", videoUrl: "https://www.youtube.com/embed/l134cBAJCuc", assignment: "Deploy full-stack app" }
    ],
    quiz: [
      { question: "Which hook manages state in React?", options: ["useState", "useEffect", "useRef", "useContext"], answer: "useState" },
      { question: "What does REST stand for?", options: ["Representational State Transfer", "Remote Execution Standard", "React Element Syntax Tree", "None"], answer: "Representational State Transfer" },
      { question: "Which command initializes a Node project?", options: ["npm init", "node start", "npm run", "node init"], answer: "npm init" }
    ],
    finalTest: [
      { question: "Which method creates a new MongoDB document?", options: ["create()", "insert()", "add()", "push()"], answer: "create()" },
      { question: "What is JWT used for?", options: ["Authentication", "Styling", "Routing", "Database"], answer: "Authentication" },
      { question: "What does useEffect do?", options: ["Runs side effects", "Manages state", "Renders JSX", "Handles routing"], answer: "Runs side effects" }
    ]
  },
  {
    title: "AI and Machine Learning Career Track",
    slug: "ai-machine-learning-career-track",
    instructor: "Dr. Meera Iyer",
    category: "AI / Machine Learning",
    price: 0,
    premium: false,
    description: "Python, ML basics, model evaluation, prompt engineering, and AI product thinking.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    modules: [
      { title: "AI Foundations & History", duration: "45m", videoUrl: "https://www.youtube.com/embed/ad79nYk2keg", assignment: "" },
      { title: "Python for ML", duration: "1h", videoUrl: "https://www.youtube.com/embed/rfscVS0vtbw", assignment: "Write a data analysis script" },
      { title: "Machine Learning Basics", duration: "1h 10m", videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU", assignment: "Train a simple classifier" },
      { title: "Neural Networks & Deep Learning", duration: "1h 20m", videoUrl: "https://www.youtube.com/embed/aircAruvnKk", assignment: "" },
      { title: "Prompt Engineering", duration: "40m", videoUrl: "https://www.youtube.com/embed/dOxUroR57xs", assignment: "Write 5 effective prompts" }
    ],
    quiz: [
      { question: "What is supervised learning?", options: ["Learning with labeled data", "Learning without data", "Reinforcement learning", "None"], answer: "Learning with labeled data" },
      { question: "Which library is used for ML in Python?", options: ["scikit-learn", "React", "Express", "jQuery"], answer: "scikit-learn" },
      { question: "What is a neural network?", options: ["A set of algorithms modeled on the human brain", "A CSS framework", "A database", "A routing library"], answer: "A set of algorithms modeled on the human brain" }
    ],
    finalTest: [
      { question: "What does GPT stand for?", options: ["Generative Pre-trained Transformer", "General Purpose Tool", "Gradient Processing Tree", "None"], answer: "Generative Pre-trained Transformer" },
      { question: "What is overfitting?", options: ["Model too complex for training data", "Model too simple", "Data is too small", "None"], answer: "Model too complex for training data" },
      { question: "What is a prompt in AI?", options: ["Input text given to an AI model", "A CSS property", "A database query", "A server route"], answer: "Input text given to an AI model" }
    ]
  },
  {
    title: "Placement Prep & Communication",
    slug: "placement-prep-communication",
    instructor: "Ananya Rao",
    category: "Placement Prep",
    price: 0,
    premium: false,
    description: "Aptitude, resume writing, HR answers, and confidence-building practice.",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    modules: [
      { title: "Aptitude & Reasoning Basics", duration: "35m", videoUrl: "https://www.youtube.com/embed/MWTt4TLORKY", assignment: "Solve 20 aptitude questions" },
      { title: "Resume Writing Masterclass", duration: "42m", videoUrl: "https://www.youtube.com/embed/Tt08KmFfIYQ", assignment: "Write your resume" },
      { title: "HR Interview Techniques", duration: "50m", videoUrl: "https://www.youtube.com/embed/KJ51IQiJjuA", assignment: "Record a mock answer" },
      { title: "Group Discussion Skills", duration: "38m", videoUrl: "https://www.youtube.com/embed/jWTCCe9RHLU", assignment: "" },
      { title: "Salary Negotiation", duration: "30m", videoUrl: "https://www.youtube.com/embed/XY5SeCl_8NE", assignment: "" }
    ],
    quiz: [
      { question: "What is the STAR method used for?", options: ["Structuring interview answers", "Writing code", "Database design", "None"], answer: "Structuring interview answers" },
      { question: "What should a resume NOT include?", options: ["Photo and religion", "Skills", "Experience", "Education"], answer: "Photo and religion" },
      { question: "What does ATS stand for?", options: ["Applicant Tracking System", "Automated Test Suite", "Application Transfer Service", "None"], answer: "Applicant Tracking System" }
    ],
    finalTest: [
      { question: "What is a good answer length for HR questions?", options: ["1-2 minutes", "10 minutes", "30 seconds", "5 minutes"], answer: "1-2 minutes" },
      { question: "Which is most important in a group discussion?", options: ["Listening and contributing", "Talking the most", "Being silent", "None"], answer: "Listening and contributing" },
      { question: "When should you negotiate salary?", options: ["After receiving an offer", "During the first interview", "Before applying", "Never"], answer: "After receiving an offer" }
    ]
  },
  {
    title: "Cloud Computing & DevOps",
    slug: "cloud-computing-devops",
    instructor: "Mr. Arjun Nair",
    category: "Cloud / DevOps",
    price: 0,
    premium: false,
    description: "Learn cloud fundamentals, AWS services, containers, CI/CD, and Kubernetes foundations.",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
    modules: [
      { title: "Cloud Fundamentals", duration: "45m", videoUrl: "https://www.youtube.com/embed/M988_fsOSWo", assignment: "" },
      { title: "AWS Core Services", duration: "1h 5m", videoUrl: "https://www.youtube.com/embed/ubCNZFXmMys", assignment: "Set up an S3 bucket" },
      { title: "Docker & Containers", duration: "1h", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo", assignment: "Dockerize a Node app" },
      { title: "CI/CD Pipelines", duration: "55m", videoUrl: "https://www.youtube.com/embed/R8_veQiYBjI", assignment: "Create a GitHub Actions workflow" },
      { title: "Kubernetes Basics", duration: "1h 10m", videoUrl: "https://www.youtube.com/embed/X48VuDVv0do", assignment: "" }
    ],
    quiz: [
      { question: "What does IaaS stand for?", options: ["Infrastructure as a Service", "Internet and Software", "Integrated API Service", "None"], answer: "Infrastructure as a Service" },
      { question: "What is Docker used for?", options: ["Containerization", "Styling", "Database management", "Authentication"], answer: "Containerization" },
      { question: "What is CI/CD?", options: ["Continuous Integration / Continuous Deployment", "Code Interface Design", "Cloud Instance Docker", "None"], answer: "Continuous Integration / Continuous Deployment" }
    ],
    finalTest: [
      { question: "What is Kubernetes?", options: ["Container orchestration system", "A cloud provider", "A CSS framework", "A database"], answer: "Container orchestration system" },
      { question: "Which AWS service hosts static websites?", options: ["S3", "EC2", "RDS", "Lambda"], answer: "S3" },
      { question: "What is a Dockerfile?", options: ["Script to build a Docker image", "A cloud config file", "A database schema", "None"], answer: "Script to build a Docker image" }
    ]
  },
  {
    title: "Cybersecurity Fundamentals",
    slug: "cybersecurity-fundamentals",
    instructor: "Ms. Priya Venkat",
    category: "Cybersecurity",
    price: 0,
    premium: false,
    description: "Build core security knowledge across networks, ethical hacking, cryptography, and safer habits.",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    modules: [
      { title: "Introduction to Cybersecurity", duration: "40m", videoUrl: "https://www.youtube.com/embed/inWWhr5tnEA", assignment: "" },
      { title: "Network Security Basics", duration: "55m", videoUrl: "https://www.youtube.com/embed/E03gh1huvW4", assignment: "" },
      { title: "Ethical Hacking Overview", duration: "1h", videoUrl: "https://www.youtube.com/embed/3Kq1MIfTWCE", assignment: "" },
      { title: "Cryptography & Encryption", duration: "50m", videoUrl: "https://www.youtube.com/embed/AQDCe585Lnc", assignment: "" },
      { title: "Security Best Practices", duration: "35m", videoUrl: "https://www.youtube.com/embed/aEmXqL-bTyE", assignment: "" }
    ],
    quiz: [
      { question: "What is phishing?", options: ["A social engineering attack via fake emails", "A type of encryption", "A firewall", "None"], answer: "A social engineering attack via fake emails" },
      { question: "What does SSL stand for?", options: ["Secure Sockets Layer", "Server Side Logic", "Simple Script Language", "None"], answer: "Secure Sockets Layer" },
      { question: "What is a firewall?", options: ["Network security system that monitors traffic", "A type of malware", "An encryption algorithm", "None"], answer: "Network security system that monitors traffic" }
    ],
    finalTest: [
      { question: "What is two-factor authentication?", options: ["Using two verification methods", "Two passwords", "Two firewalls", "None"], answer: "Using two verification methods" },
      { question: "What is a VPN?", options: ["Virtual Private Network", "Very Private Node", "Verified Protocol Network", "None"], answer: "Virtual Private Network" },
      { question: "What is SQL injection?", options: ["Inserting malicious SQL into a query", "A database backup method", "A type of CSS", "None"], answer: "Inserting malicious SQL into a query" }
    ]
  },
  {
    title: "Data Science & Analytics",
    slug: "data-science-analytics",
    instructor: "Dr. Suresh Kumar",
    category: "Data Science",
    price: 0,
    premium: false,
    description: "Practice Python, Pandas, visualization, statistics, and applied machine learning for analytics roles.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    modules: [
      { title: "Data Science Overview", duration: "40m", videoUrl: "https://www.youtube.com/embed/X3paOmcrTjQ", assignment: "" },
      { title: "Python & Pandas", duration: "1h 10m", videoUrl: "https://www.youtube.com/embed/vmEHCJofslg", assignment: "Analyze a dataset" },
      { title: "Data Visualization", duration: "55m", videoUrl: "https://www.youtube.com/embed/a9UrKTVEeZA", assignment: "Create 3 charts" },
      { title: "Statistics for Data Science", duration: "1h", videoUrl: "https://www.youtube.com/embed/xxpc-HPKN28", assignment: "" },
      { title: "Machine Learning for Data Scientists", duration: "1h 15m", videoUrl: "https://www.youtube.com/embed/7eh4d6sabA0", assignment: "" }
    ],
    quiz: [
      { question: "What is a DataFrame in Pandas?", options: ["A 2D data structure", "A chart type", "A database table", "A Python class"], answer: "A 2D data structure" },
      { question: "What does EDA stand for?", options: ["Exploratory Data Analysis", "Encrypted Data Access", "Event Driven Architecture", "None"], answer: "Exploratory Data Analysis" },
      { question: "Which chart shows data distribution?", options: ["Histogram", "Line chart", "Pie chart", "Scatter plot"], answer: "Histogram" }
    ],
    finalTest: [
      { question: "What is correlation?", options: ["Statistical relationship between variables", "A type of chart", "A Python function", "None"], answer: "Statistical relationship between variables" },
      { question: "What is the mean?", options: ["Average of all values", "Middle value", "Most frequent value", "None"], answer: "Average of all values" },
      { question: "What library is used for visualization in Python?", options: ["Matplotlib", "Express", "React", "MongoDB"], answer: "Matplotlib" }
    ]
  }
];
