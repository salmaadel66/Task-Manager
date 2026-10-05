
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [
    RouterLink,
    MatCardModule,
    MatIconModule
  ],
  selector: 'app-not-found',
  styleUrl: './not-found.scss',
  templateUrl: './not-found.html'
})
export class NotFound {}

