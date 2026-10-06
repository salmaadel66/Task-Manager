import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService, authErrorMessage } from '../../services/auth-service/auth-service';

import {
  matchPassword,
  noEdgeSpaces,
  phoneNumber,
  requiredTrimmed,
  strongPassword,
  trimmedLength
} from '../../shared/validators';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  authService = inject(AuthService);
  router = inject(Router);

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  registerForm = new FormGroup(
    {
      fullName: new FormControl('', [
        requiredTrimmed,
        trimmedLength(3, 100)
      ]),

      email: new FormControl('', [
        Validators.required,
         Validators.email,
      ]),

      phone: new FormControl('', [
        Validators.required,
        phoneNumber
      ]),

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        strongPassword,
        noEdgeSpaces
      ]),

      confirmPassword: new FormControl('', [
        Validators.required
      ]),

      hobbies: new FormArray<FormControl<string | null>>([]),

      terms: new FormControl(false, [
        Validators.requiredTrue
      ])
    },
    {
      validators: matchPassword
    }
  );

  get hobbies() {
    return this.registerForm.controls.hobbies;
  }

  addHobby() {
    this.hobbies.push(
      new FormControl('', [
        requiredTrimmed,
        trimmedLength(2, 50)
      ])
    );
  }

  removeHobby(index: number) {
    this.hobbies.removeAt(index);
  }

  constructor() {
    this.registerForm.controls.password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.registerForm.controls.confirmPassword.updateValueAndValidity();
      });
  }

  async onSubmit() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const value = this.registerForm.getRawValue();

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.register({
        fullName: value.fullName?.trim() || '',
        email: value.email?.trim() || '',
        phone: value.phone?.trim() || '',
        password: value.password || '',
        hobbies: value.hobbies.map(hobby => hobby?.trim() || '')
      });

      this.router.navigate(['/login']);
    } catch (e) {
      this.errorMessage.set(authErrorMessage(e));
    } finally {
      this.loading.set(false);
    }
  }
}

