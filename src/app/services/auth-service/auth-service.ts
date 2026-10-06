
import { DestroyRef, Injectable, inject, signal } from '@angular/core';

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

  ready: Promise<void>;

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.ready = new Promise<void>(resolve => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        this.user.set(user);
        resolve();
      });

      destroyRef.onDestroy(unsubscribe);
    });
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean
  ) {
    if (rememberMe) {
      await setPersistence(auth, browserLocalPersistence);
    } else {
      await setPersistence(auth, browserSessionPersistence);
    }

    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  async register(data: RegisterData) {
    const result = await createUserWithEmailAndPassword(
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

  logout() {
    return signOut(auth);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

}

