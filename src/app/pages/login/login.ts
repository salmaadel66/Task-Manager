import { Component, inject, signal } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService, authErrorMessage } from '../../services/auth-service/auth-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
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

  loginForm = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),

    rememberMe: new FormControl(false)

  });

  async onSubmit() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const value = this.loginForm.getRawValue();

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.login(
        value.email || '',
        value.password || '',
        value.rememberMe || false
      );

      this.router.navigate(['/']);
    } catch (e) {
      this.errorMessage.set(authErrorMessage(e));
    } finally {
      this.loading.set(false);
    }
  }

  async onForgotPassword() {

    const email = this.loginForm.controls.email;

    if (email.invalid) {
      email.markAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await this.authService.resetPassword(
        email.value || ''
      );

      this.successMessage.set(
        'If an account exists for this email, a password reset link has been sent.'
      );
    } catch (e) {
      this.errorMessage.set(authErrorMessage(e));
    }
  }
}