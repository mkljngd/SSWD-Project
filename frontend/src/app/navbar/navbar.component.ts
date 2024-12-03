import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isLoggedIn = false;
  isAdmin = false;
  isMenuOpen = false;

  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.isLoggedIn = true;
      this.isAdmin = payload.role === 'admin';
    }
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.closeMenu()
    localStorage.removeItem('token');
    localStorage.removeItem('active_profile');
    localStorage.removeItem('user_id');
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }
}
