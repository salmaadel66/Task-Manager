import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const trimmedEmail: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  return !value || EMAIL_PATTERN.test(value) ? null : { email: true };
};

export const noEdgeSpaces: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '');
  return value && value !== value.trim() ? { edgeSpaces: true } : null;
};

export const requiredTrimmed: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  String(control.value ?? '').trim() ? null : { required: true };

export const trimmedLength = (min: number, max: number): ValidatorFn => (control) => {
  const length = String(control.value ?? '').trim().length;
  if (!length) return null;
  if (length < min) return { minlength: true };
  return length > max ? { maxlength: true } : null;
};

export const phoneNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  if (!value) return null;
  if (!/^\d+$/.test(value)) return { phoneChars: true };
  return value.length >= 10 && value.length <= 15 ? null : { phoneLength: true };
};

export const strongPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '');
  if (!value) return null;
  const errors = {
    ...(/[A-Z]/.test(value) ? {} : { uppercase: true }),
    ...(/[a-z]/.test(value) ? {} : { lowercase: true }),
    ...(/\d/.test(value) ? {} : { number: true }),
    ...(/[^A-Za-z0-9]/.test(value) ? {} : { special: true })
  };
  return Object.keys(errors).length ? errors : null;
};

export const matchPassword: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const confirm = group.get('confirmPassword');
  if (!confirm) return null;
  const mismatch = group.get('password')?.value !== confirm.value;
  const errors = { ...confirm.errors };
  if (mismatch) {
    errors['mismatch'] = true;
  } else {
    delete errors['mismatch'];
  }
  confirm.setErrors(Object.keys(errors).length ? errors : null);
  return null;
};

export const firebaseErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in Firebase.';
    default:
      return 'Something went wrong. Please try again.';
  }
};
