import { Component, inject } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import { TaskService } from '../../services/task-service/task-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  selector: 'app-task-form',
  styleUrl: './task-form.scss',
  templateUrl: './task-form.html'
})
export class TaskForm {

  private service = inject(TaskService);
  private authService = inject(AuthService);
  private router = inject(Router);

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required),
    completed: new FormControl(false)
  });

  async onSubmit() {

    if (this.taskForm.invalid) {
      return;
    }

    await this.service.addTask({
      userId: this.authService.user()!.uid,
      title: this.taskForm.value.title ?? '',
      desc: this.taskForm.value.desc ?? '',
      completed: this.taskForm.value.completed ?? false,
      createdAt: new Date()
    });

    this.router.navigate(['/tasks', this.authService.encodedUid()]);
  }
}