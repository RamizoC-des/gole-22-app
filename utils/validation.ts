export const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Optional fields are valid if empty
  try {
    const newUrl = new URL(url);
    // Ensure the protocol is either http or https
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:' ;
  } catch (_) {
    return false;
  }
};

export const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Optional fields are valid if empty
  // A simple regex for email validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  // Simple regex for international phone numbers (allows +, digits, spaces, hyphens)
  const regex = /^[+]?[\d\s-]{7,20}$/;
  return regex.test(phone);
};