// Fix 10: Input Validation on Profile Updates
export const validateProfileUpdate = (data) => {
  const errors = [];
  
  if (data.name) {
    if (data.name.length < 2 || data.name.length > 50) {
      errors.push("Name must be between 2 and 50 characters");
    }
    if (!/^[a-zA-Z\s\-']+$/.test(data.name)) {
      errors.push("Name contains invalid characters");
    }
  }
  
  if (data.phone) {
    if (!/^\+?[\d\s\-()]{10,15}$/.test(data.phone)) {
      errors.push("Invalid phone number format");
    }
  }
  
  if (data.email && !isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }
  
  return { valid: errors.length === 0, errors };
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Basic XSS prevention
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '');
};