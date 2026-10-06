import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService, toDate } from '../../services/task-service/task-service';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [
    MatTooltipModule,
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

  task = this.taskService.getTaskById(this.taskId);

  get createdAt(): Date | null {
    return this.task?.createdAt ? toDate(this.task.createdAt) : null;
  }
}