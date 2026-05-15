export function required(value, label = 'This field') {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${label} is required`;
  }
  return null;
}

export function email(value) {
  if (!value) return null;
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  return ok ? null : 'Enter a valid email';
}

export function minLength(value, n, label = 'This field') {
  if (!value) return null;
  if (String(value).trim().length < n) return `${label} must be at least ${n} characters`;
  return null;
}

export function phone(value) {
  if (!value) return null;
  const digits = String(value).replace(/\D/g, '');
  if (digits.length < 10) return 'Enter a valid phone number';
  return null;
}
