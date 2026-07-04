// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { api, apiError } from '../../services/api.js';
import './CareerChat.css';

const CareerChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('welcome');
  const [userData, setUserData] = useState({
    skills: [],
    interests: [],
    experience: 'entry',
    education: 'bachelor'
  });
  const [recommendations, setRecommendations] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    initializeAgent();
  }, []);

  const initializeAgent = async () => {
    addBotMessage("👋 Welcome! I'm your Career AI Assistant. Let's find the perfect career path for you!");
    addBotMessage("I'll ask you a few questions about your skills and interests. Ready to begin? (Type 'yes' to start)");
  };

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: Date.now() }]);
  };

  const addBotMessage = (content) => addMessage('bot', content);
  const addUserMessage = (content) => addMessage('user', content);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userInput = input.trim();
    setInput('');
    addUserMessage(userInput);
    setLoading(true);

    try {
      await processUserInput(userInput);
    } catch (error) {
      console.error('Error processing input:', error);
      addBotMessage("❌ Sorry, I encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processUserInput = async (input) => {
    const lowerInput = input.toLowerCase();

    switch (step) {
      case 'welcome':
        if (lowerInput.includes('yes') || lowerInput.includes('start') || lowerInput.includes('ready')) {
          setStep('collect_skills');
          addBotMessage("Great! First, tell me about your technical and soft skills.");
          addBotMessage("Please list your skills separated by commas (e.g., Python, JavaScript, Leadership, Communication)");
        } else {
          addBotMessage("No problem! Take your time. I'm here whenever you're ready to start your career journey.");
        }
        break;

      case 'collect_skills': {
        const skills = input.split(',').map(s => s.trim()).filter(Boolean);
        if (skills.length === 0) {
          addBotMessage("Please enter at least one skill.");
          return;
        }
        setUserData(prev => ({ ...prev, skills }));
        setStep('collect_interests');
        addBotMessage(`Got it! Skills: ${skills.join(', ')}`);
        addBotMessage("Now, what are your interests? (e.g., Technology, Design, Business, Creative Arts)");
        break;
      }

      case 'collect_interests': {
        const interests = input.split(',').map(i => i.trim()).filter(Boolean);
        if (interests.length === 0) {
          addBotMessage("Please enter at least one interest.");
          return;
        }
        setUserData(prev => ({ ...prev, interests }));
        setStep('collect_experience');
        addBotMessage(`Interests noted: ${interests.join(', ')}`);
        addBotMessage("What's your experience level? (entry, mid, senior)");
        break;
      }

      case 'collect_experience': {
        const experience = input.toLowerCase().trim();
        if (['entry', 'mid', 'senior'].includes(experience)) {
          setUserData(prev => ({ ...prev, experience }));
          setStep('collect_education');
          addBotMessage(`Experience level: ${experience}`);
          addBotMessage("Finally, what's your highest education level? (highschool, bachelor, master, phd)");
        } else {
          addBotMessage("Please enter one of: entry, mid, or senior");
        }
        break;
      }

      case 'collect_education': {
        const education = input.toLowerCase().trim();
        if (['highschool', 'bachelor', 'master', 'phd'].includes(education)) {
          const updatedData = { ...userData, education };
          setUserData(updatedData);
          
          // Get recommendations
          addBotMessage("🎯 Analyzing your profile... This might take a moment.");
          setLoading(true);
          
          try {
            const result = await getSuggestions(updatedData);
            setRecommendations(result);
            displayRecommendations(result);
            setStep('results');
          } catch (err) {
            addBotMessage("❌ Couldn't generate recommendations. Please try again.");
            setStep('welcome');
          }
        } else {
          addBotMessage("Please enter one of: highschool, bachelor, master, phd");
        }
        break;
      }

      case 'results':
        await handleResultPhase(input);
        break;

      case 'analyzing':
        addBotMessage("I'm analyzing this career. You can ask me questions about it.");
        setStep('results');
        break;

      default:
        addBotMessage("How can I help you with your career journey?");
    }
  };

  const getSuggestions = async (data) => {
    try {
      const token = localStorage.getItem('nexa_token');
      if (!token) {
        // Fallback to local matching if not authenticated
        return getLocalRecommendations(data);
      }
      
      const response = await api.post('/career/suggestions', {
        skills: data.skills,
        interests: data.interests,
        experience: data.experience,
        education: data.education
      });
      return response.data.recommendations;
    } catch (error) {
      console.warn('API unavailable, using local matching:', apiError(error));
      return getLocalRecommendations(data);
    }
  };

  // Local career database for offline/fallback matching
  const LOCAL_CAREERS = [
    {
      title: 'Software Developer',
      category: 'technology',
      skills: ['JavaScript', 'Python', 'Java', 'React', 'Node.js'],
      averageSalary: '$80,000 - $150,000',
      growth: '+22%',
      education: "Bachelor's in Computer Science"
    },
    {
      title: 'Data Scientist',
      category: 'technology',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
      averageSalary: '$95,000 - $165,000',
      growth: '+31%',
      education: "Master's or PhD in Data Science"
    },
    {
      title: 'Cybersecurity Analyst',
      category: 'technology',
      skills: ['Network Security', 'Penetration Testing', 'Security', 'Risk Management'],
      averageSalary: '$85,000 - $155,000',
      growth: '+33%',
      education: "Bachelor's in Cybersecurity"
    },
    {
      title: 'UI/UX Designer',
      category: 'creative',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design'],
      averageSalary: '$70,000 - $130,000',
      growth: '+20%',
      education: "Bachelor's in Design"
    },
    {
      title: 'Product Manager',
      category: 'business',
      skills: ['Strategic Planning', 'Agile', 'Market Analysis', 'Leadership'],
      averageSalary: '$90,000 - $170,000',
      growth: '+15%',
      education: "Bachelor's in Business"
    },
    {
      title: 'Digital Marketing Specialist',
      category: 'business',
      skills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics'],
      averageSalary: '$55,000 - $100,000',
      growth: '+12%',
      education: "Bachelor's in Marketing"
    },
    {
      title: 'Data Analyst',
      category: 'business',
      skills: ['SQL', 'Excel', 'Tableau', 'Python', 'Statistics'],
      averageSalary: '$60,000 - $110,000',
      growth: '+20%',
      education: "Bachelor's in Statistics"
    },
    {
      title: 'AI Engineer',
      category: 'technology',
      skills: ['Python', 'TensorFlow', 'Machine Learning', 'NLP', 'Docker'],
      averageSalary: '$120,000 - $180,000',
      growth: '+35%',
      education: "Master's in AI"
    },
    {
      title: 'Cloud Architect',
      category: 'technology',
      skills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform'],
      averageSalary: '$130,000 - $190,000',
      growth: '+28%',
      education: "Bachelor's in Computer Science"
    },
    {
      title: 'DevOps Engineer',
      category: 'technology',
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Linux'],
      averageSalary: '$90,000 - $160,000',
      growth: '+25%',
      education: "Bachelor's in Computer Science"
    }
  ];

  const getLocalRecommendations = (data) => {
    const skillsLower = data.skills.map(s => s.toLowerCase());
    const results = LOCAL_CAREERS.map(career => {
      const careerSkills = career.skills.map(s => s.toLowerCase());
      const matchCount = careerSkills.filter(s => skillsLower.includes(s)).length;
      const matchScore = Math.round((matchCount / careerSkills.length) * 100);
      return {
        ...career,
        matchScore,
        missingSkills: careerSkills.filter(s => !skillsLower.includes(s))
      };
    })
    .filter(c => c.matchScore > 20)
    .sort((a, b) => b.matchScore - a.matchScore);

    return {
      primary: results.slice(0, 3),
      alternative: results.slice(3, 6),
      emerging: [
        { title: 'AI/ML Engineer', match: 'High', description: 'Design AI solutions', futureDemand: 'Very High' },
        { title: 'Blockchain Developer', match: 'Medium', description: 'Build dApps', futureDemand: 'High' }
      ],
      skillGap: results[0] ? {
        matchPercentage: results[0].matchScore,
        missingSkills: results[0].missingSkills,
        matchedSkills: careerSkills => careerSkills.filter(s => skillsLower.includes(s.toLowerCase()))
      } : null
    };
  };

  const displayRecommendations = (result) => {
    if (!result || !result.primary || result.primary.length === 0) {
      addBotMessage("❌ Couldn't generate recommendations. Please try again with different skills.");
      return;
    }

    addBotMessage("🎉 Here are my career recommendations based on your profile:");

    result.primary.forEach((career, index) => {
      const matchEmoji = career.matchScore > 80 ? '🌟' : 
                        career.matchScore > 60 ? '⭐' : '💡';
      addBotMessage(`${matchEmoji} **${index + 1}. ${career.title}** (${career.matchScore}% match)`);
      addBotMessage(`   💰 ${career.averageSalary || 'Competitive salary'}`);
      addBotMessage(`   📈 ${career.growth || 'Good growth potential'}`);
      if (career.skills) {
        addBotMessage(`   🔧 Key skills: ${career.skills.slice(0, 4).join(', ')}`);
      }
    });

    if (result.alternative && result.alternative.length > 0) {
      addBotMessage("\n🤔 **Alternative career paths to consider:**");
      result.alternative.forEach(career => {
        addBotMessage(`   • ${career.title} (${career.matchScore}% match)`);
      });
    }

    addBotMessage("\n💡 Type a number (1-3) to explore a career in detail, or ask about roadmaps or comparisons!");
  };

  const handleResultPhase = async (input) => {
    const num = parseInt(input);
    
    if (!isNaN(num) && num > 0 && num <= recommendations.primary.length) {
      const career = recommendations.primary[num - 1];
      setSelectedCareer(career);
      setStep('analyzing');
      addBotMessage(`📊 **${career.title} - Detailed Analysis**`);
      addBotMessage(`   🔹 Salary: ${career.averageSalary || 'Competitive'}`);
      addBotMessage(`   🔹 Growth: ${career.growth || 'Good'}`);
      addBotMessage(`   🔹 Education: ${career.education || 'Varies'}`);
      if (career.missingSkills && career.missingSkills.length > 0) {
        addBotMessage(`   🔹 Skills to develop: ${career.missingSkills.slice(0, 4).join(', ')}`);
      }
      addBotMessage("\n💡 Would you like me to generate a detailed roadmap? (Type 'roadmap' to continue)");
    } 
    else if (input.toLowerCase().includes('roadmap')) {
      if (selectedCareer) {
        const roadmapData = generateLocalRoadmap(userData.experience, selectedCareer.title);
        displayRoadmap(roadmapData);
      } else {
        addBotMessage("Please select a career first by typing its number (1-3).");
      }
    } 
    else if (input.toLowerCase().includes('compare')) {
      if (recommendations.primary.length >= 2) {
        displayComparison(recommendations.primary[0], recommendations.primary[1]);
      } else {
        addBotMessage("Not enough careers to compare. Try getting new recommendations.");
      }
    } 
    else if (input.toLowerCase() === 'trending') {
      displayTrending();
    }
    else {
      addBotMessage("You can explore careers by typing 1, 2, or 3. Or ask for 'roadmap', 'compare', or 'trending'.");
    }
  };

  const generateLocalRoadmap = (currentRole, targetRole) => {
    const levels = ['Junior', 'Mid-Level', 'Senior', 'Lead'];
    const currentLevel = currentRole === 'senior' ? 2 : currentRole === 'mid' ? 1 : 0;
    const milestones = levels.slice(currentLevel).map((level, i) => ({
      title: level,
      timeframe: `${i * 6} - ${(i + 1) * 6} months`,
      actions: [
        `Master ${targetRole} core skills`,
        'Complete 2-3 projects',
        'Build professional portfolio',
        'Network with industry professionals'
      ]
    }));

    return {
      currentRole: levels[currentLevel],
      targetRole,
      timeframe: '12 months',
      milestones,
      totalDuration: '12 months'
    };
  };

  const displayRoadmap = (roadmapData) => {
    if (!roadmapData) {
      addBotMessage("❌ Couldn't generate roadmap.");
      return;
    }

    addBotMessage(`🗺️ **Career Roadmap: ${roadmapData.currentRole || 'Entry'} → ${roadmapData.targetRole}**`);
    addBotMessage(`   📅 Timeline: ${roadmapData.timeframe}`);
    
    if (roadmapData.milestones) {
      roadmapData.milestones.forEach((milestone, index) => {
        addBotMessage(`\n   🎯 **${milestone.title}** (${milestone.timeframe})`);
        if (milestone.actions) {
          milestone.actions.slice(0, 3).forEach(action => {
            addBotMessage(`      ✓ ${action}`);
          });
        }
      });
    }

    addBotMessage("\n💡 This roadmap is customized for you. Type 'save' to save it or ask for more details.");
  };

  const displayComparison = (career1, career2) => {
    addBotMessage("📊 **Career Comparison**");
    addBotMessage(`🔹 ${career1.title}: ${career1.matchScore}% match | 💰 ${career1.averageSalary || 'Competitive'}`);
    addBotMessage(`🔹 ${career2.title}: ${career2.matchScore}% match | 💰 ${career2.averageSalary || 'Competitive'}`);
    
    if (career1.matchScore > career2.matchScore) {
      addBotMessage(`📈 **${career1.title}** is a better match based on your profile.`);
    } else {
      addBotMessage(`📈 **${career2.title}** is a better match based on your profile.`);
    }
  };

  const displayTrending = () => {
    addBotMessage("🔥 **Trending Careers in 2024**");
    addBotMessage("   📌 **AI Engineer** - +35% growth - $120k-$180k");
    addBotMessage("   📌 **Data Engineer** - +30% growth - $100k-$160k");
    addBotMessage("   📌 **Cloud Architect** - +28% growth - $130k-$190k");
    addBotMessage("   📌 **Cybersecurity Analyst** - +33% growth - $85k-$155k");
    addBotMessage("   📌 **DevOps Engineer** - +25% growth - $90k-$160k");
  };

  const handleQuickOption = async (value) => {
    setInput(value);
    
    if (value === 'start' && step === 'welcome') {
      setStep('collect_skills');
      addBotMessage("Great! Let's start by listing your skills.");
      addBotMessage("Please list your skills separated by commas (e.g., Python, JavaScript, Leadership)");
    } else if (value === 'trending') {
      displayTrending();
    } else if (value === 'save' && recommendations) {
      try {
        localStorage.setItem(`career_results_${Date.now()}`, JSON.stringify({
          userData,
          recommendations,
          timestamp: new Date().toISOString()
        }));
        addBotMessage("✅ Assessment saved successfully!");
      } catch {
        addBotMessage("❌ Failed to save assessment.");
      }
    } else if (value === 'clear') {
      setMessages([]);
      setStep('welcome');
      setRecommendations(null);
      setSelectedCareer(null);
      setUserData({ skills: [], interests: [], experience: 'entry', education: 'bachelor' });
      initializeAgent();
    }
  };

  return (
    <div className="career-chat-container">
      <div className="chat-header">
        <div className="header-content">
          <div className="title">
            <span className="icon">🚀</span>
            <h3>Career AI Assistant</h3>
          </div>
          <div className="status">
            <span className={`status-dot ${step !== 'welcome' ? 'active' : ''}`} />
            <span className="status-text">
              {step === 'welcome' ? 'Ready' : 
               step === 'collect_skills' || step === 'collect_interests' || step === 'collect_experience' || step === 'collect_education' ? 'Learning about you' :
               step === 'results' ? 'Career matched' :
               'Analyzing...'}
            </span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-screen">
            <div className="welcome-icon">🎯</div>
            <h2>Find Your Dream Career</h2>
            <p>Answer a few questions and I'll suggest personalized career paths based on your skills and interests.</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.role === 'bot' && <div className="avatar">🤖</div>}
              <div className="bubble" dangerouslySetInnerHTML={{ 
                __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }} />
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message bot">
            <div className="message-content">
              <div className="avatar">🤖</div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      <div className="quick-options">
        {step === 'welcome' && (
          <button className="quick-option-btn" onClick={() => handleQuickOption('start')} disabled={loading}>
            Start Assessment
          </button>
        )}
        {(step === 'results' || step === 'analyzing') && (
          <>
            {selectedCareer && (
              <button className="quick-option-btn" onClick={() => handleQuickOption('roadmap')} disabled={loading}>
                Get Roadmap
              </button>
            )}
            <button className="quick-option-btn" onClick={() => handleQuickOption('save')} disabled={loading}>
              Save Results
            </button>
          </>
        )}
        <button className="quick-option-btn" onClick={() => handleQuickOption('trending')} disabled={loading}>
          Trending Careers
        </button>
        <button className="quick-option-btn" onClick={() => handleQuickOption('clear')} disabled={loading}>
          Clear & Start Over
        </button>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={step === 'welcome' ? "Type 'yes' to start..." : "Type your answer here..."}
          disabled={loading}
          className="chat-input"
        />
        <button 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
          className="send-btn"
        >
          {loading ? '⏳' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default CareerChat;