
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth-service/auth-service';
import { Task, TaskService } from '../../services/task-service/task-service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule
  ],
  selector: 'app-task-list',
  styleUrl: './task-list.scss',
  templateUrl: './task-list.html',
})
export class TaskList implements OnInit {

  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  taskLink() {
    return ['/task', this.authService.encodedUid()];
  }

  tasks = signal<Task[]>([]);
  loaded = signal(false);

  async ngOnInit() {
    let uid = this.authService.user()!.uid;

    let saved = this.taskService.getSavedTasks(uid);

    if (saved) {
      this.tasks.set(saved);
      this.loaded.set(true);
      return;
    }

    try {
      this.tasks.set(await this.taskService.loadTasks(uid));
    } catch (error) {
      console.error('Failed to load tasks.', error);
    }

    this.loaded.set(true);
  }

}
