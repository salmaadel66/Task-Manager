
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html'
})
export class Navbar {

  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;
  tasksLink() {
    return ['/tasks', this.authService.encodedUid()];
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

}

