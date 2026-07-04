// Career path database (can be moved to MongoDB)
const CAREER_DATABASE = {
  'technology': {
    'software_development': {
      title: 'Software Developer',
      paths: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps'],
      skills: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker'],
      averageSalary: '$80,000 - $150,000',
      growth: '+22% (faster than average)',
      education: "Bachelor's in Computer Science or related",
      certifications: ['AWS Certified', 'Google Cloud', 'Microsoft Certified']
    },
    'data_science': {
      title: 'Data Scientist',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
      averageSalary: '$95,000 - $165,000',
      growth: '+31% (much faster than average)',
      education: "Master's or PhD in Data Science, Statistics, or related"
    },
    'cybersecurity': {
      title: 'Cybersecurity Analyst',
      skills: ['Network Security', 'Penetration Testing', 'Security Auditing', 'Risk Management'],
      averageSalary: '$85,000 - $155,000',
      growth: '+33% (much faster than average)',
      education: "Bachelor's in Cybersecurity or related"
    },
    'ai_engineering': {
      title: 'AI Engineer',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps', 'Docker'],
      averageSalary: '$120,000 - $180,000',
      growth: '+35% (much faster than average)',
      education: "Master's in AI, ML, or Computer Science"
    },
    'cloud_architecture': {
      title: 'Cloud Architect',
      skills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'CI/CD', 'Networking'],
      averageSalary: '$130,000 - $190,000',
      growth: '+28% (much faster than average)',
      education: "Bachelor's in Computer Science or related"
    },
    'devops': {
      title: 'DevOps Engineer',
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'Ansible', 'Terraform', 'CI/CD', 'Linux'],
      averageSalary: '$90,000 - $160,000',
      growth: '+25% (much faster than average)',
      education: "Bachelor's in Computer Science or related"
    }
  },
  'creative': {
    'ui_ux': {
      title: 'UI/UX Designer',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems', 'Wireframing'],
      averageSalary: '$70,000 - $130,000',
      growth: '+20% (faster than average)',
      education: "Bachelor's in Design, HCI, or related"
    },
    'graphic_design': {
      title: 'Graphic Designer',
      skills: ['Adobe Creative Suite', 'Typography', 'Layout Design', 'Branding', 'Illustration'],
      averageSalary: '$45,000 - $85,000',
      growth: '+10% (average)',
      education: "Bachelor's in Graphic Design or related"
    },
    'motion_design': {
      title: 'Motion Graphics Designer',
      skills: ['After Effects', 'Cinema 4D', 'Animation', '3D Modeling', 'Video Editing'],
      averageSalary: '$55,000 - $100,000',
      growth: '+15% (faster than average)',
      education: "Bachelor's in Animation, Design, or related"
    }
  },
  'business': {
    'product_management': {
      title: 'Product Manager',
      skills: ['Strategic Planning', 'User Stories', 'Agile', 'Market Analysis', 'Leadership', 'A/B Testing'],
      averageSalary: '$90,000 - $170,000',
      growth: '+15% (faster than average)',
      education: "Bachelor's in Business, Engineering, or related"
    },
    'digital_marketing': {
      title: 'Digital Marketing Specialist',
      skills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics', 'Email Marketing', 'PPC'],
      averageSalary: '$55,000 - $100,000',
      growth: '+12% (faster than average)',
      education: "Bachelor's in Marketing, Communications, or related"
    },
    'data_analytics': {
      title: 'Data Analyst',
      skills: ['SQL', 'Excel', 'Tableau', 'Power BI', 'Python', 'Statistics', 'Data Visualization'],
      averageSalary: '$60,000 - $110,000',
      growth: '+20% (faster than average)',
      education: "Bachelor's in Statistics, Mathematics, or related"
    },
    'management_consulting': {
      title: 'Management Consultant',
      skills: ['Strategic Analysis', 'Problem Solving', 'Client Management', 'Presentation', 'Research'],
      averageSalary: '$85,000 - $160,000',
      growth: '+14% (faster than average)',
      education: "MBA or Bachelor's in Business"
    }
  },
  'healthcare': {
    'health_informatics': {
      title: 'Health Informatics Specialist',
      skills: ['Healthcare IT', 'Data Analysis', 'EHR Systems', 'HIPAA Compliance', 'SQL'],
      averageSalary: '$70,000 - $120,000',
      growth: '+18% (faster than average)',
      education: "Bachelor's in Health Informatics or related"
    },
    'biotech': {
      title: 'Biotechnology Researcher',
      skills: ['Lab Research', 'Data Analysis', 'Bioinformatics', 'CRISPR', 'Clinical Trials'],
      averageSalary: '$65,000 - $130,000',
      growth: '+16% (faster than average)',
      education: "Master's or PhD in Biotechnology or related"
    }
  },
  'finance': {
    'fintech': {
      title: 'FinTech Developer',
      skills: ['Blockchain', 'Smart Contracts', 'Solidity', 'DeFi', 'JavaScript', 'Python', 'Security'],
      averageSalary: '$100,000 - $175,000',
      growth: '+25% (much faster than average)',
      education: "Bachelor's in Computer Science, Finance, or related"
    },
    'financial_analyst': {
      title: 'Financial Analyst',
      skills: ['Financial Modeling', 'Excel', 'Bloomberg', 'Valuation', 'Risk Analysis', 'Accounting'],
      averageSalary: '$60,000 - $120,000',
      growth: '+12% (faster than average)',
      education: "Bachelor's in Finance, Economics, or related"
    }
  }
};

// Try to use OpenAI if API key is available
const getAIRecommendations = async (skills, interests, experience) => {
  try {
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
      Analyze the following skills and interests to recommend suitable career paths.
      
      Skills: ${skills.join(', ')}
      Interests: ${interests.join(', ')}
      Experience Level: ${experience}
      
      Provide a JSON response with:
      1. Top 5 career recommendations with reasons
      2. Match percentage for each
      3. Required skills that may be missing
      4. Alternative career paths
      
      Format as JSON with this structure:
      {
        "recommendations": [
          {
            "title": "Career Title",
            "matchScore": 85,
            "reason": "Why this career fits",
            "requiredSkills": ["skill1", "skill2"],
            "missingSkills": ["skill3", "skill4"],
            "growthPotential": "High",
            "averageSalary": "$80,000"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: "You are a career counselor AI specializing in matching skills to career paths." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response.recommendations || [];
  } catch (error) {
    console.warn('AI recommendation unavailable, using database fallback:', error.message);
    return [];
  }
};

// Database matching (fallback)
const matchFromDatabase = (skills, interests) => {
  const matches = [];
  const skillsLower = skills.map(s => s.toLowerCase());
  const interestsLower = interests.map(i => i.toLowerCase());

  // Iterate through career database
  for (const [category, careers] of Object.entries(CAREER_DATABASE)) {
    for (const [key, career] of Object.entries(careers)) {
      const careerSkills = career.skills.map(s => s.toLowerCase());
      const matchCount = careerSkills.filter(skill => skillsLower.includes(skill)).length;
      const matchPercentage = Math.round((matchCount / careerSkills.length) * 100);

      if (matchPercentage > 20) {
        matches.push({
          ...career,
          id: key,
          category,
          matchScore: matchPercentage,
          missingSkills: careerSkills.filter(skill => !skillsLower.includes(skill))
        });
      }
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

// Combine AI and database recommendations
const combineRecommendations = (aiRecs, dbMatches) => {
  const combined = [];
  
  // Add AI recommendations with priority
  if (aiRecs && aiRecs.length > 0) {
    combined.push(...aiRecs.map(rec => ({
      ...rec,
      source: 'ai',
      priority: 1
    })));
  }
  
  // Add database matches that aren't duplicates
  dbMatches.forEach(match => {
    if (!combined.some(c => c.title === match.title)) {
      combined.push({
        ...match,
        source: 'database',
        priority: 2
      });
    }
  });

  return combined.sort((a, b) => (a.priority || 3) - (b.priority || 3) || b.matchScore - a.matchScore);
};

// Enrich recommendations with additional data
const enrichRecommendations = async (recommendations, education, location) => {
  return Promise.all(recommendations.map(async (rec) => {
    const enriched = { ...rec };
    
    // Add education requirements
    if (!enriched.education) {
      enriched.education = getEducationRequirements(rec.title, education);
    }
    
    // Add location-based insights
    if (location) {
      enriched.locationInsights = await getLocationInsights(rec.title, location);
    }
    
    // Add learning resources
    enriched.learningResources = await getLearningResources(rec.title);
    
    return enriched;
  }));
};

// Get education requirements for a career
const getEducationRequirements = (title, currentEducation) => {
  const requirements = {
    'Software Developer': "Bachelor's in Computer Science or equivalent",
    'Data Scientist': "Master's in Data Science or Statistics",
    'Product Manager': "Bachelor's in Business, Engineering, or related",
    'UI/UX Designer': "Bachelor's in Design, HCI, or related",
    'Cybersecurity Analyst': "Bachelor's in Cybersecurity or related",
    'AI Engineer': "Master's in AI, ML, or Computer Science",
    'Cloud Architect': "Bachelor's in Computer Science or related",
    'DevOps Engineer': "Bachelor's in Computer Science or related"
  };
  
  const baseReq = requirements[title] || "Bachelor's degree in relevant field";
  return {
    required: baseReq,
    current: currentEducation || 'Not specified',
    gap: currentEducation !== 'master' ? 'Consider advanced education' : 'You meet the requirements'
  };
};

// Get location-based insights
const getLocationInsights = async (title, location) => {
  // This could call a job API or market data API
  return {
    marketDemand: location === 'remote' ? 'High' : 'Medium-High',
    averageSalary: location === 'remote' ? '$85,000 - $150,000' : '$75,000 - $130,000',
    jobPostings: '~1,500+ in your area'
  };
};

// Get learning resources for a career
const getLearningResources = async (title) => {
  // Could integrate with Coursera, Udemy, etc.
  return [
    {
      platform: 'Coursera',
      course: `Introduction to ${title}`,
      duration: '6 weeks'
    },
    {
      platform: 'LinkedIn Learning',
      course: `Become a ${title}`,
      duration: '4 weeks'
    }
  ];
};

// Get emerging careers based on skills
const getEmergingCareers = async (skills) => {
  const skillsLower = skills.map(s => s.toLowerCase());
  const emerging = [
    {
      title: 'AI/ML Engineer',
      match: skillsLower.includes('python') || skillsLower.includes('machine learning') ? 'High' : 'Medium',
      description: 'Design and implement AI solutions',
      futureDemand: 'Very High'
    },
    {
      title: 'Blockchain Developer',
      match: skillsLower.includes('solidity') || skillsLower.includes('blockchain') ? 'High' : 'Medium',
      description: 'Build decentralized applications',
      futureDemand: 'High'
    },
    {
      title: 'Quantum Computing Researcher',
      match: skillsLower.includes('physics') || skillsLower.includes('mathematics') ? 'Medium' : 'Low',
      description: 'Research quantum computing applications',
      futureDemand: 'High'
    }
  ];
  
  return emerging;
};

// Calculate skill gap
const calculateSkillGap = async (currentSkills, targetCareer) => {
  if (!targetCareer) return null;
  
  const targetSkills = targetCareer.requiredSkills || targetCareer.skills || [];
  const currentLower = currentSkills.map(s => s.toLowerCase());
  const missing = targetSkills.filter(skill => !currentLower.includes(skill.toLowerCase()));
  const match = targetSkills.filter(skill => currentLower.includes(skill.toLowerCase()));
  
  return {
    missingSkills: missing,
    matchedSkills: match,
    matchPercentage: Math.round((match.length / targetSkills.length) * 100),
    recommendations: missing.map(skill => ({
      skill,
      resource: getResourceForSkill(skill)
    }))
  };
};

// Get resource for a specific skill
const getResourceForSkill = (skill) => {
  const resources = {
    'JavaScript': 'freeCodeCamp - JavaScript Course',
    'Python': 'Python.org - Official Tutorial',
    'React': 'React.dev - Official Documentation',
    'AWS': 'AWS Training and Certification',
    'Data Science': 'Kaggle - Learn Data Science',
    'UI/UX': 'Interaction Design Foundation',
    'Marketing': 'HubSpot Academy - Digital Marketing',
    'Leadership': 'Harvard Business Review - Leadership Skills'
  };
  return resources[skill] || 'Online learning platform';
};

// Generate career recommendations using AI
export const generateCareerRecommendations = async ({ skills, interests, experience, education, location }) => {
  try {
    // First, try AI-powered recommendations
    const aiRecommendations = await getAIRecommendations(skills, interests, experience);
    
    // Then, fallback to database matching
    const dbMatches = matchFromDatabase(skills, interests);
    
    // Combine and rank
    const combined = combineRecommendations(aiRecommendations, dbMatches);
    
    // Enrich with additional data
    const enriched = await enrichRecommendations(combined, education, location);
    
    return {
      primary: enriched.slice(0, 3), // Top 3 career paths
      alternative: enriched.slice(3, 6), // Next 3
      emerging: await getEmergingCareers(skills),
      skillGap: await calculateSkillGap(skills, enriched[0])
    };
  } catch (error) {
    console.error('AI recommendation error:', error);
    // Fallback to database-only matching
    const dbMatches = matchFromDatabase(skills, interests);
    return {
      primary: dbMatches.slice(0, 3),
      alternative: dbMatches.slice(3, 6),
      emerging: [],
      skillGap: null
    };
  }
};

// Analyze career path in detail
export const analyzeCareerPath = async (careerPath, skills, interests) => {
  // Find career in database
  let career = null;
  for (const category of Object.values(CAREER_DATABASE)) {
    for (const [key, value] of Object.entries(category)) {
      if (value.title === careerPath || key === careerPath) {
        career = value;
        break;
      }
    }
    if (career) break;
  }

  if (!career) {
    return {
      exists: false,
      message: 'Career path not found in database'
    };
  }

  return {
    exists: true,
    career: career,
    skillMatch: skills ? await calculateSkillGap(skills, career) : null,
    interestAlignment: interests ? analyzeInterestAlignment(interests, career) : null,
    roadmap: await generateCareerRoadmap('entry', career.title, '1-year')
  };
};

// Analyze interest alignment
const analyzeInterestAlignment = (interests, career) => {
  const careerKeywords = {
    'Software Developer': ['coding', 'problem_solving', 'technology', 'innovation'],
    'Data Scientist': ['analytics', 'statistics', 'problem_solving', 'research'],
    'UI/UX Designer': ['design', 'creativity', 'user_experience', 'visual'],
    'Product Manager': ['strategy', 'leadership', 'business', 'product_development'],
    'Cybersecurity Analyst': ['security', 'networks', 'risk', 'protection'],
    'AI Engineer': ['artificial_intelligence', 'machine_learning', 'innovation', 'technology'],
    'Cloud Architect': ['cloud', 'infrastructure', 'scalability', 'architecture'],
    'DevOps Engineer': ['automation', 'deployment', 'infrastructure', 'ci_cd'],
    'Digital Marketing Specialist': ['marketing', 'social_media', 'content', 'analytics'],
    'Data Analyst': ['analytics', 'data', 'visualization', 'reporting'],
    'Financial Analyst': ['finance', 'analysis', 'modeling', 'investing'],
    'Management Consultant': ['strategy', 'consulting', 'business', 'problem_solving']
  };

  const keywords = careerKeywords[career.title] || [];
  const interestsLower = interests.map(i => i.toLowerCase().replace(/\s+/g, '_'));
  const matches = interestsLower.filter(interest => 
    keywords.some(keyword => interest.includes(keyword) || keyword.includes(interest))
  );

  return {
    alignmentScore: keywords.length > 0 ? Math.round((matches.length / keywords.length) * 100) : 50,
    matchedInterests: matches,
    missingInterests: keywords.filter(k => !interestsLower.some(i => i.includes(k) || k.includes(i)))
  };
};

// Get trending career paths
export const getTrendingCareerPaths = async (location, industry) => {
  // This would ideally call a job market API
  return {
    topTrending: [
      {
        title: 'AI Engineer',
        growth: '+35%',
        demand: 'Very High',
        salary: '$120,000 - $180,000'
      },
      {
        title: 'Data Engineer',
        growth: '+30%',
        demand: 'High',
        salary: '$100,000 - $160,000'
      },
      {
        title: 'Cloud Architect',
        growth: '+28%',
        demand: 'High',
        salary: '$130,000 - $190,000'
      },
      {
        title: 'Cybersecurity Analyst',
        growth: '+33%',
        demand: 'Very High',
        salary: '$85,000 - $155,000'
      },
      {
        title: 'DevOps Engineer',
        growth: '+25%',
        demand: 'High',
        salary: '$90,000 - $160,000'
      }
    ],
    industrySpecific: industry ? {
      technology: ['Software Engineer', 'DevOps Engineer', 'Security Analyst'],
      healthcare: ['Health Informatics', 'Medical Researcher'],
      finance: ['FinTech Developer', 'Financial Analyst']
    }[industry] : []
  };
};

// Generate career roadmap
export const generateCareerRoadmap = async (currentRole, targetRole, timeframe) => {
  // Parse timeframe
  const months = parseInt(timeframe) || 12;
  const milestones = [];
  
  // Common career progression
  const progression = {
    'entry': ['Junior', 'Mid-Level', 'Senior', 'Lead'],
    'mid': ['Mid-Level', 'Senior', 'Lead', 'Manager'],
    'senior': ['Senior', 'Lead', 'Manager', 'Director']
  };

  const currentLevel = currentRole.toLowerCase().includes('senior') ? 'senior' : 
                       currentRole.toLowerCase().includes('lead') || currentRole.toLowerCase().includes('mid') ? 'mid' : 'entry';
  
  const path = progression[currentLevel] || progression['entry'];
  const steps = Math.min(path.length, Math.ceil(months / 6) + 1);

  for (let i = 0; i < steps && i < path.length; i++) {
    const milestone = {
      title: path[i],
      timeframe: `${i * 6} - ${(i + 1) * 6} months`,
      actions: getActionsForLevel(path[i], targetRole),
      skills: getSkillsForLevel(path[i], targetRole),
      resources: getResourcesForLevel(path[i], targetRole)
    };
    milestones.push(milestone);
  }

  return {
    currentRole,
    targetRole,
    timeframe: `${months} months`,
    milestones,
    totalDuration: `${months} months`
  };
};

// Helper functions for roadmap
const getActionsForLevel = (level, targetRole) => {
  const actions = {
    'Junior': [
      'Master core technical skills',
      'Complete 2-3 projects',
      'Build portfolio',
      'Network with professionals'
    ],
    'Mid-Level': [
      'Take on leadership roles in projects',
      'Mentor junior developers',
      'Specialize in areas',
      'Contribute to open source'
    ],
    'Senior': [
      'Lead projects and teams',
      'Architect solutions',
      'Mentor others',
      'Contribute to strategy'
    ],
    'Lead': [
      'Lead multiple teams',
      'Drive technical strategy',
      'Interview and hire',
      'Influence product direction'
    ],
    'Manager': [
      'Manage team performance',
      'Drive project delivery',
      'Develop team members',
      'Align with business goals'
    ],
    'Director': [
      'Set technical vision',
      'Manage multiple teams',
      'Drive organizational change',
      'Executive stakeholder management'
    ]
  };
  
  return actions[level] || ['Continue developing skills'];
};

const getSkillsForLevel = (level, targetRole) => {
  // This would return specific skills needed
  return {
    technical: ['Programming', 'System Design', 'Testing'],
    soft: ['Communication', 'Leadership', 'Problem Solving']
  };
};

const getResourcesForLevel = (level, targetRole) => {
  return [
    {
      type: 'Course',
      name: `Advanced ${targetRole} Skills`,
      platform: 'Coursera'
    },
    {
      type: 'Book',
      name: `${targetRole} Handbook`,
      author: 'Industry Expert'
    }
  ];
};