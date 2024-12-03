import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const apiUrl = `${environment.apiUrl}/auth/forgot-password`;
    this.http.post(apiUrl, { email: this.email }).subscribe({
      next: () => {
        this.successMessage = 'Password reset link sent to your email.';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to send reset link. Please try again.';
        this.successMessage = '';
      },
    });
  }
}
