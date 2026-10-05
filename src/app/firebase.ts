import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUKAPMzY_kAU7F4RXXyeNC8T5EpnUfWA4",
  authDomain: "task-manager-d929b.firebaseapp.com",
  projectId: "task-manager-d929b",
  storageBucket: "task-manager-d929b.firebasestorage.app",
  messagingSenderId: "20577883091",
  appId: "1:20577883091:web:16fffb726c2ff6cee89526",
  measurementId: "G-J6WTXB1J9P"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);