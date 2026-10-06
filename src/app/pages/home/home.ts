import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth-service/auth-service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html'
})
export class Home {

  authService = inject(AuthService);

  features = [
    {
      icon: 'add_task',
      title: 'Create tasks',
      description: 'Add tasks with a title and description in seconds.'
    },
    {
      icon: 'checklist',
      title: 'Track progress',
      description: 'See which tasks are pending and which are completed.'
    },
    {
      icon: 'lock',
      title: 'Private & secure',
      description: 'Your tasks are only available after you sign in.'
    }
  ];
}
