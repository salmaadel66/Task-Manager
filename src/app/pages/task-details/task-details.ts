import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '../../services/task-service/task-service';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  selector: 'app-task-details',
  styleUrl: './task-details.scss',
  templateUrl: './task-details.html',
})
export class TaskDetails {

  taskService = inject(TaskService);
  route = inject(ActivatedRoute);

  taskId = Number(this.route.snapshot.paramMap.get('id'));

  task = this.taskService.tasks().find(
    task => task.id === this.taskId
  );

  get createdAt(): Date | null {
    const value: unknown = this.task?.createdAt;
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof (value as { toDate?: unknown }).toDate === 'function') {
      return (value as { toDate: () => Date }).toDate();
    }
    return new Date(value as string | number);
  }
}