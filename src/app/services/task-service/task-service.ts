import { Injectable, signal } from '@angular/core';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export interface Task {
  id: number;
  title: string;
  desc: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks = signal<Task[]>([]);

  constructor() {
    this.getTasks();
  }

  async getTasks() {
    const data = await getDocs(collection(db, 'tasks'));

    const tasks = data.docs.map(doc => ({
      id: doc.data()['id'],
      ...doc.data()
    })) as Task[];

    this.tasks.set(tasks);
  }

  async addTask(task: Omit<Task, 'id'>) {
    const id = this.tasks().length + 1;

    await addDoc(collection(db, 'tasks'), {
      id: id,
      ...task
    });

    await this.getTasks();
  }
}