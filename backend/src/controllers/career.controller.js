import { generateCareerRecommendations, analyzeCareerPath, getTrendingCareerPaths, generateCareerRoadmap } from '../utils/careerAI.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isLocalMode } from '../utils/dataMode.js';
import { saveReport as saveLocalReport } from '../utils/localStore.js';

// Get career suggestions based on skills and interests
export const getCareerSuggestions = asyncHandler(async (req, res) => {
  const { skills, interests, experience, education, location } = req.body;
  
  if (!skills || !interests) {
    return res.status(400).json({ 
      error: "Skills and interests are required" 
    });
  }

  // Validate input
  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ 
      error: "Skills must be a non-empty array" 
    });
  }

  if (!Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({ 
      error: "Interests must be a non-empty array" 
    });
  }

  try {
    const recommendations = await generateCareerRecommendations({
      skills,
      interests,
      experience: experience || 'entry',
      education: education || 'bachelor',
      location: location || 'remote'
    });

    // Save to user's career history
    if (req.user) {
      const userId = req.user._id || req.user.id;
      if (isLocalMode()) {
        saveLocalReport({
          userId,
          type: 'career',
          title: 'Career Suggestions',
          data: { skills, interests, recommendations, timestamp: new Date().toISOString() }
        });
      } else {
        try {
          const Report = (await import('../models/Report.js')).default;
          await Report.create({
            userId,
            type: 'career',
            title: 'Career Suggestions',
            data: { skills, interests, recommendations, timestamp: new Date().toISOString() }
          });
        } catch (dbError) {
          console.warn('Could not save career suggestion to DB:', dbError.message);
        }
      }
    }

    res.json({
      success: true,
      recommendations,
      metadata: {
        skillsAnalyzed: skills.length,
        interestsAnalyzed: interests.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Career suggestion error:', error);
    res.status(500).json({ 
      error: "Failed to generate career suggestions. Please try again." 
    });
  }
});

// Get detailed career path analysis
export const getCareerPathAnalysis = asyncHandler(async (req, res) => {
  const { careerPath, skills, interests } = req.body;
  
  if (!careerPath) {
    return res.status(400).json({ error: "Career path is required" });
  }

  try {
    const analysis = await analyzeCareerPath(careerPath, skills, interests);
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Career path analysis error:', error);
    res.status(500).json({ 
      error: "Failed to analyze career path" 
    });
  }
});

// Get trending careers in market
export const getTrendingCareers = asyncHandler(async (req, res) => {
  const { location, industry } = req.query;
  
  try {
    const trending = await getTrendingCareerPaths(location, industry);
    res.json({
      success: true,
      trending
    });
  } catch (error) {
    console.error('Trending careers error:', error);
    res.status(500).json({ 
      error: "Failed to fetch trending careers" 
    });
  }
});

// Get career roadmap
export const getCareerRoadmap = asyncHandler(async (req, res) => {
  const { currentRole, targetRole, timeframe } = req.body;
  
  if (!currentRole || !targetRole) {
    return res.status(400).json({ 
      error: "Current role and target role are required" 
    });
  }

  try {
    const roadmap = await generateCareerRoadmap(currentRole, targetRole, timeframe || '1-year');
    res.json({
      success: true,
      roadmap
    });
  } catch (error) {
    console.error('Career roadmap error:', error);
    res.status(500).json({ 
      error: "Failed to generate career roadmap" 
    });
  }
});