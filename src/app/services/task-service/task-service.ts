import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { AuthService } from '../auth-service/auth-service';
const STORAGE_KEY = 'tasks';

export interface Task {
  id: number;
  userId: string;
  title: string;
  desc: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private authService = inject(AuthService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  tasks = signal<Task[]>([]);

  /** False until the current user's tasks are known (from cache or Firestore). */
  loaded = signal(false);

  private currentUid: string | null = null;
  private loading: Promise<void> = Promise.resolve();

  constructor() {
    // Reload the task list whenever the signed-in user changes (login / logout / switch account)
    effect(() => {
      this.authService.user();
      this.ensureLoaded();
    });
  }

  /** Makes sure `tasks` holds the current user's tasks only. */
  async ensureLoaded(): Promise<void> {
    await this.authService.ready;

    const uid = this.authService.user()?.uid ?? null;

    if (uid !== this.currentUid) {
      this.currentUid = uid;
      this.loading = this.loadTasks(uid);
    }

    return this.loading;
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks().find(task => task.id === id);
  }

  async addTask(task: Omit<Task, 'id' | 'userId'>) {
    await this.ensureLoaded();

    const uid = this.currentUid;
    if (!uid) {
      throw new Error('You must be logged in to add a task.');
    }

    const newTask: Task = {
      id: Math.max(0, ...this.tasks().map(t => t.id)) + 1,
      userId: uid,
      ...task
    };

    await addDoc(collection(db, 'tasks'), newTask);

    this.tasks.update(tasks => [...tasks, newTask]);
    this.saveToStorage(uid, this.tasks());
  }

  private async loadTasks(uid: string | null) {
    this.loaded.set(false);

    if (!uid) {
      this.tasks.set([]);
      this.saveToStorage(null, []); 
      return;
    }

    // Show the cached copy right away, then refresh from Firestore
    const cached = this.readFromStorage(uid);
    this.tasks.set(cached);
    if (cached.length) this.loaded.set(true);

    try {
      const data = await getDocs(
        query(collection(db, 'tasks'), where('userId', '==', uid))
      );

      const tasks = data.docs.map(doc => {
        const task = doc.data() as Task;
        return { ...task, createdAt: toDate(task.createdAt) };
      });

      // Ignore the result if the user changed while we were fetching
      if (this.currentUid !== uid) return;

      this.tasks.set(tasks);
      this.saveToStorage(uid, tasks);
    } catch (error) {
      console.error('Failed to load tasks, using cached data.', error);
    } finally {
      if (this.currentUid === uid) this.loaded.set(true);
    }
  }


  private readFromStorage(uid: string): Task[] {
    if (!this.isBrowser) return [];

    try {
      const cache = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (cache?.uid !== uid) return [];

      return (cache.tasks as Task[]).map(task => ({ ...task, createdAt: new Date(task.createdAt) }));
    } catch {
      return [];
    }
  }

  private saveToStorage(uid: string | null, tasks: Task[]) {
    if (!this.isBrowser) return;

    try {
      if (uid) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ uid, tasks }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage full or blocked — Firestore is still the source of truth
    }
  }
}

/** Firestore returns Timestamps; localStorage returns strings. Normalize both to Date. */
export function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (value && typeof (value as { toDate?: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  return new Date(value as string | number);
}
