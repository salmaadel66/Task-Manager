import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  AuthService,
  authErrorMessage
} from '../../services/auth-service/auth-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  authService = inject(AuthService);
  router = inject(Router);

  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  email = '';
  password = '';
  rememberMe = false;

  async onSubmit(form: NgForm) {

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.login(
        this.email,
        this.password,
        this.rememberMe
      );

      this.router.navigate(['/']);

    } catch (error) {
      this.errorMessage.set(authErrorMessage(error));

    } finally {
      this.loading.set(false);
    }
  }

  async onForgotPassword(form: NgForm) {

    const emailControl = form.controls['email'];

    if (emailControl.invalid) {
      emailControl.markAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await this.authService.resetPassword(this.email);

      this.successMessage.set(
        'If an account exists for this email, a password reset link has been sent.'
      );

    } catch (error) {
      this.errorMessage.set(authErrorMessage(error));
    }
  }
}
