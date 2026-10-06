import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

export interface Task {
  id: string;
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

  async getTasks(uid: string) {
    let data = await getDocs(
      query(collection(db, 'tasks'), where('userId', '==', uid))
    );

    return data.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data()['createdAt'].toDate()
    }) as Task);
  }

  async loadTasks(uid: string) {
    let tasks = await this.getTasks(uid);
    this.saveTasks(uid, tasks);
    return tasks;
  }

  getSavedTasks(uid: string): Task[] | null {
    let saved = localStorage.getItem('tasks-' + uid);

    if (!saved) {
      return null;
    }

    return JSON.parse(saved);
  }

  saveTasks(uid: string, tasks: Task[]) {
    localStorage.setItem('tasks-' + uid, JSON.stringify(tasks));
  }

  async addTask(task: Omit<Task, 'id'>) {
    let ref = await addDoc(collection(db, 'tasks'), task);

    let saved = this.getSavedTasks(task.userId);

    if (saved) {
      this.saveTasks(task.userId, [...saved, { ...task, id: ref.id }]);
    }

    return ref;
  }
}
