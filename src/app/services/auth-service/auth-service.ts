
import { Injectable, signal } from '@angular/core';

import {
  User,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from '../../firebase';


export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  hobbies: string[];
  password: string;
}


export function authErrorMessage(error: any): string {

  switch (error.code) {

    case 'auth/user-not-found':
      return 'No account found with this email.';

    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/user-disabled':
      return 'This account has been disabled.';

    case 'auth/email-already-in-use':
      return 'This email is already registered.';

    case 'auth/weak-password':
      return 'Password must be at least 8 characters.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';

    case 'auth/network-request-failed':
      return 'Please check your internet connection.';

    default:
      return 'Something went wrong. Please try again.';
  }
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, user => {
      this.user.set(user);
    });
  }

  async waitForUser() {
    await auth.authStateReady();
    this.user.set(auth.currentUser);
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean
  ) {
    if (rememberMe) {
      await setPersistence(auth, browserLocalPersistence);
      localStorage.setItem('rememberedEmail', email);
    } else {
      await setPersistence(auth, browserSessionPersistence);
      localStorage.removeItem('rememberedEmail');
    }

    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  getRememberedEmail() {
    let email = localStorage.getItem('rememberedEmail');

    if (email) {
      return email;
    }

    return '';
  }

  async register(data: RegisterData) {
    let result = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    await updateProfile(result.user, {
      displayName: data.fullName
    });

    await setDoc(
      doc(db, 'users', result.user.uid),
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        hobbies: data.hobbies
      }
    );

    await signOut(auth);
  }

  encodedUid() {
    let user = this.user();

    if (!user) {
      return '';
    }

    return btoa(user.uid);
  }

  logout() {
    let user = this.user();

    if (user) {
      localStorage.removeItem('tasks-' + user.uid);
    }

    return signOut(auth);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

}

