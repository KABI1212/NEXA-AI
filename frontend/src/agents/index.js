// @ts-nocheck
/**
 * NEXA AI - Multi-Agent System
 * 
 * Each agent has its own prompt, tools, memory, and API
 * The orchestrator routes requests to the appropriate agent
 */

export const AGENTS = {
    career: {
        id: "career",
        name: "Career Agent",
        icon: "BriefcaseBusiness",
        description: "Career exploration, path recommendations, job matching",
        systemPrompt: `You are Nexa AI's Career Agent. You help users discover careers, match with jobs, and plan career growth. 
    Analyze user profiles, skills, and goals to provide personalized career recommendations.
    Return structured JSON with: careers, salaryRanges, roadmaps, companiesHiring, recommendedRoles.`,
        tools: ["careerExplorer", "jobSearch", "salaryInsights"],
        memory: true,
        contextKeys: ["profile", "skills", "interests", "goals"],
    },
    resume: {
        id: "resume",
        name: "Resume Agent",
        icon: "FileText",
        description: "Resume analysis, ATS scoring, optimization, cover letters",
        systemPrompt: `You are Nexa AI's Resume Agent. You analyze resumes, calculate ATS scores, suggest improvements, and generate cover letters.
    Focus on keywords, formatting, achievements, and role-specific optimization.
    Return structured JSON with: atsScore, improvements, missingKeywords, betterSummary, roleMatch.`,
        tools: ["resumeAnalyzer", "coverLetter", "atsOptimizer"],
        memory: true,
        contextKeys: ["resumeText", "targetRole", "experience"],
    },
    interview: {
        id: "interview",
        name: "Interview Agent",
        icon: "Briefcase",
        description: "Interview preparation, mock interviews, company insights",
        systemPrompt: `You are Nexa AI's Interview Agent. You prepare users for interviews with company-specific questions, coding challenges, and mock interviews.
    Provide HR questions, technical rounds, coding tests, and STAR format answers.
    Return structured JSON with: company, hrQuestions, technicalRounds, codingTests, answers, mockInterview.`,
        tools: ["interviewPrep", "mockInterview", "companyInsights"],
        memory: true,
        contextKeys: ["company", "role", "experience", "skills"],
    },
    coding: {
        id: "coding",
        name: "Coding Agent",
        icon: "Terminal",
        description: "Coding practice, algorithms, projects, code review",
        systemPrompt: `You are Nexa AI's Coding Agent. You help users practice coding, solve algorithms, review code, and suggest projects.
    Provide code challenges, solutions with explanations, best practices, and project ideas.
    Return structured JSON with: challenge, solution, explanation, complexity, tips.`,
        tools: ["codeReview", "challengeGenerator", "projectSuggestions"],
        memory: true,
        contextKeys: ["language", "skillLevel", "topics"],
    },
    learning: {
        id: "learning",
        name: "Learning Agent",
        icon: "GraduationCap",
        description: "Course recommendations, learning paths, study plans",
        systemPrompt: `You are Nexa AI's Learning Agent. You recommend courses, create learning paths, and generate study plans.
    Consider user's current skills, goals, and available time to create personalized learning journeys.
    Return structured JSON with: courses, learningPath, milestones, duration, resources.`,
        tools: ["courseRecommender", "learningPath", "studyPlanner"],
        memory: true,
        contextKeys: ["skills", "goals", "availableTime", "completedCourses"],
    },
    certification: {
        id: "certification",
        name: "Certification Agent",
        icon: "Award",
        description: "Certificate guidance, exam prep, credential tracking",
        systemPrompt: `You are Nexa AI's Certification Agent. You guide users toward valuable certifications, prepare them for exams, and track their credential progress.
    Recommend certifications based on career goals and current skill level.
    Return structured JSON with: certifications, prepResources, timeline, cost, value.`,
        tools: ["certRecommender", "examPrep", "credentialTracker"],
        memory: true,
        contextKeys: ["careerGoal", "skills", "budget", "timeframe"],
    },
    mentor: {
        id: "mentor",
        name: "Mentor Agent",
        icon: "MessageCircle",
        description: "General career mentorship, guidance, Q&A",
        systemPrompt: `You are Nexa AI's Mentor Agent. You provide general career guidance, answer questions, and offer personalized advice.
    Be empathetic, practical, and supportive. Draw from all other agents' expertise when needed.
    Return structured JSON with: answer, suggestions, resources, nextSteps.`,
        tools: ["generalQA", "careerAdvice", "skillGuidance"],
        memory: true,
        contextKeys: ["all"],
    },
    analytics: {
        id: "analytics",
        name: "Analytics Agent",
        icon: "BarChart3",
        description: "Progress tracking, insights, recommendations",
        systemPrompt: `You are Nexa AI's Analytics Agent. You track user progress, generate insights, and provide data-driven recommendations.
    Analyze learning patterns, skill growth, and career readiness to provide actionable insights.
    Return structured JSON with: progress, insights, recommendations, trends, goals.`,
        tools: ["progressTracker", "insightGenerator", "trendAnalysis"],
        memory: true,
        contextKeys: ["activity", "courses", "certificates", "skills"],
    },
    planner: {
        id: "planner",
        name: "Planner Agent",
        icon: "Calendar",
        description: "Study planning, roadmaps, scheduling",
        systemPrompt: `You are Nexa AI's Planner Agent. You create study plans, weekly/monthly roadmaps, and help users stay on track.
    Consider user's available time, goals, deadlines, and learning pace.
    Return structured JSON with: weeklyPlan, monthlyPlan, milestones, tasks, schedule.`,
        tools: ["studyPlanner", "roadmapGenerator", "taskManager"],
        memory: true,
        contextKeys: ["goals", "availableTime", "deadline", "currentSkills"],
    },
    notification: {
        id: "notification",
        name: "Notification Agent",
        icon: "Bell",
        description: "Smart reminders, alerts, updates",
        systemPrompt: `You are Nexa AI's Notification Agent. You send smart reminders, alerts about deadlines, course updates, and career opportunities.
    Be context-aware and timely with notifications.
    Return structured JSON with: notifications, priority, timing, action.`,
        tools: ["reminderSystem", "alertGenerator", "opportunityAlerts"],
        memory: false,
        contextKeys: ["schedule", "goals", "activities"],
    },
};

const MAX_CONVERSATIONS = 50;
const MAX_MEMORIES = 100;
const CONVERSATION_TTL = 24 * 60 * 60 * 1000; // 24 hours

export default class AgentOrchestrator {
    constructor() {
        this.agents = AGENTS;
        this.conversations = new Map();
        this.memories = new Map();
        // Fix 17: Clean up old conversations and memories hourly
        this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000);
    }

    cleanup() {
        const now = Date.now();

        // Clean up old conversations
        for (const [key, value] of this.conversations) {
            if (now - value.lastAccessed > CONVERSATION_TTL) {
                this.conversations.delete(key);
            }
        }

        // Limit conversation map size
        if (this.conversations.size > MAX_CONVERSATIONS) {
            const sorted = Array.from(this.conversations.entries())
                .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
            const toDelete = sorted.slice(0, this.conversations.size - MAX_CONVERSATIONS);
            toDelete.forEach(([key]) => this.conversations.delete(key));
        }

        // Limit memories size
        if (this.memories.size > MAX_MEMORIES) {
            const sorted = Array.from(this.memories.entries())
                .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));
            const toDelete = sorted.slice(0, this.memories.size - MAX_MEMORIES);
            toDelete.forEach(([key]) => this.memories.delete(key));
        }
    }

    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }

    getAgent(agentId) {
        return this.agents[agentId] || this.agents.mentor;
    }

    async route(query, context = {}) {
        // Determine the best agent based on query intent
        const agent = this.selectAgent(query, context);

        // Build enhanced prompt with context
        const enhancedContext = this.buildContext(agent, context);

        return {
            agent: agent.id,
            agentName: agent.name,
            systemPrompt: agent.systemPrompt,
            context: enhancedContext,
        };
    }

    selectAgent(query, context) {
        const queryLower = query.toLowerCase();

        if (queryLower.includes("career") || queryLower.includes("job") || queryLower.includes("salary")) return this.agents.career;
        if (queryLower.includes("resume") || queryLower.includes("cv") || queryLower.includes("cover letter")) return this.agents.resume;
        if (queryLower.includes("interview") || queryLower.includes("mock") || queryLower.includes("company")) return this.agents.interview;
        if (queryLower.includes("code") || queryLower.includes("programming") || queryLower.includes("algorithm")) return this.agents.coding;
        if (queryLower.includes("course") || queryLower.includes("learn") || queryLower.includes("study")) return this.agents.learning;
        if (queryLower.includes("certificate") || queryLower.includes("certification") || queryLower.includes("exam")) return this.agents.certification;
        if (queryLower.includes("plan") || queryLower.includes("roadmap") || queryLower.includes("schedule")) return this.agents.planner;
        if (queryLower.includes("progress") || queryLower.includes("analytics") || queryLower.includes("insight")) return this.agents.analytics;

        // Default to mentor for general queries
        return this.agents.mentor;
    }

    buildContext(agent, context) {
        const relevantKeys = agent.contextKeys;
        if (relevantKeys.includes("all")) return context;

        const filtered = {};
        for (const key of relevantKeys) {
            if (context[key]) filtered[key] = context[key];
        }
        return filtered;
    }

    saveConversation(userId, sessionId, messages) {
        const key = `${userId}:${sessionId}`;
        this.conversations.set(key, { messages, lastAccessed: Date.now() });
    }

    getConversation(userId, sessionId) {
        const entry = this.conversations.get(`${userId}:${sessionId}`);
        if (entry) {
            entry.lastAccessed = Date.now();
            return entry.messages;
        }
        return [];
    }

    saveMemory(userId, key, value) {
        const userKey = `user:${userId}`;
        const existing = this.memories.get(userKey) || { timestamp: Date.now() };
        existing[key] = value;
        existing.timestamp = Date.now();
        this.memories.set(userKey, existing);
    }

    getMemory(userId, key) {
        const userKey = `user:${userId}`;
        const userMemories = this.memories.get(userKey);
        return userMemories ? userMemories[key] : null;
    }
}