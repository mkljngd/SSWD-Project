import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const apiUrl = `${environment.apiUrl}/auth/login`;
    this.http
      .post(apiUrl, { email: this.email, password: this.password })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user_id', response.user_id);
          localStorage.setItem('active_profile', "75eebc1d-4a24-4ff6-8f19-47390c80b5d5");
          this.router.navigate(['/recipes']);
        },
        error: () => {
          this.errorMessage = 'Invalid email or password.';
        },
      });
  }
}
