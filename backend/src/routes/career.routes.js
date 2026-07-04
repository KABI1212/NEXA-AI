import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { 
  getCareerSuggestions,
  getCareerPathAnalysis,
  getTrendingCareers,
  getCareerRoadmap
} from '../controllers/career.controller.js';
import rateLimit from 'express-rate-limit';

// Career-specific rate limiter
const careerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 minutes
  message: { error: "Too many career requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

const router = express.Router();

// Public routes (limited)
router.get('/trending', careerLimiter, getTrendingCareers);

// Protected routes
router.post('/suggestions', protect, careerLimiter, getCareerSuggestions);
router.post('/analyze', protect, careerLimiter, getCareerPathAnalysis);
router.post('/roadmap', protect, careerLimiter, getCareerRoadmap);

export default router;