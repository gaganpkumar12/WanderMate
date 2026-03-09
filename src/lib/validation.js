// Form validation utilities for WanderMate

// Email validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, error: "Email is required" };
  if (!emailRegex.test(email))
    return { valid: false, error: "Invalid email format" };
  return { valid: true };
}

// Username validation
export function validateUsername(username) {
  if (!username) return { valid: false, error: "Username is required" };
  if (username.length < 3)
    return { valid: false, error: "Username must be at least 3 characters" };
  if (username.length > 30)
    return { valid: false, error: "Username must be 30 characters or less" };
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      error:
        "Username can only contain letters, numbers, underscores, and dashes",
    };
  }
  return { valid: true };
}

// First name validation
export function validateFirstName(firstName) {
  if (!firstName) return { valid: false, error: "First name is required" };
  if (firstName.length < 2)
    return { valid: false, error: "First name must be at least 2 characters" };
  if (firstName.length > 50)
    return { valid: false, error: "First name must be 50 characters or less" };
  return { valid: true };
}

// Last name validation
export function validateLastName(lastName) {
  if (!lastName) return { valid: false, error: "Last name is required" };
  if (lastName.length < 2)
    return { valid: false, error: "Last name must be at least 2 characters" };
  if (lastName.length > 50)
    return { valid: false, error: "Last name must be 50 characters or less" };
  return { valid: true };
}

// Date of birth validation
export function validateDateOfBirth(dateString) {
  if (!dateString) return { valid: false, error: "Date of birth is required" };

  const date = new Date(dateString);
  if (isNaN(date.getTime()))
    return { valid: false, error: "Invalid date format" };

  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  if (age < 18)
    return { valid: false, error: "You must be at least 18 years old" };
  if (age > 120)
    return { valid: false, error: "Please enter a valid date of birth" };

  return { valid: true };
}

// Bio validation
export function validateBio(bio) {
  if (!bio) return { valid: false, error: "Bio is required" };
  if (bio.length < 10)
    return { valid: false, error: "Bio must be at least 10 characters" };
  if (bio.length > 500)
    return { valid: false, error: "Bio must be 500 characters or less" };
  return { valid: true };
}

// Avatar validation
export function validateAvatar(file) {
  if (!file) return { valid: false, error: "Avatar is required" };

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: "Avatar must be JPEG, PNG, or WebP" };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: "Avatar must be less than 5MB" };
  }

  return { valid: true };
}

// Travel style validation (at least one must be selected)
export function validateTravelStyle(styles) {
  if (!Array.isArray(styles) || styles.length === 0) {
    return { valid: false, error: "Please select at least one travel style" };
  }
  return { valid: true };
}

// Dietary options validation
export function validateDietary(options) {
  if (!Array.isArray(options)) {
    return { valid: false, error: "Invalid dietary preferences" };
  }
  return { valid: true };
}

// Interest tags validation (at least one must be selected)
export function validateInterests(interests) {
  if (!Array.isArray(interests) || interests.length === 0) {
    return { valid: false, error: "Please select at least one interest" };
  }
  if (interests.length > 10) {
    return { valid: false, error: "You can select up to 10 interests" };
  }
  return { valid: true };
}

// Budget level validation
export function validateBudgetLevel(budget) {
  const validBudgets = ["budget", "moderate", "comfort", "luxury"];
  if (!budget || !validBudgets.includes(budget)) {
    return { valid: false, error: "Please select a valid budget level" };
  }
  return { valid: true };
}

// Languages validation
export function validateLanguages(languages) {
  if (!Array.isArray(languages) || languages.length === 0) {
    return { valid: false, error: "Please select at least one language" };
  }
  return { valid: true };
}

export default {
  validateEmail,
  validateUsername,
  validateFirstName,
  validateLastName,
  validateDateOfBirth,
  validateBio,
  validateAvatar,
  validateTravelStyle,
  validateDietary,
  validateInterests,
  validateBudgetLevel,
  validateLanguages,
};
