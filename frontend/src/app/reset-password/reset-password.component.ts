import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  newPassword: string = '';
  token: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
  }

  onSubmit() {
    const apiUrl = `${environment.apiUrl}/auth/reset-password/${this.token}`;
    this.http.post(apiUrl, { newPassword: this.newPassword }).subscribe({
      next: () => {
        this.successMessage = 'Password reset successfully.';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to reset password. Please try again.';
        this.successMessage = '';
      },
    });
  }
}
