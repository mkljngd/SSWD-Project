import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent implements OnInit {
  profiles: any[] = [];
  userId = localStorage.getItem('user_id');
  currentProfile: any = { profile_name: '', dietary_preferences: { vegetarian: false, vegan: false, allergies: [] } };
  showDialog: boolean = false;
  isEditMode: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProfiles();
  }

  fetchProfiles(): void {
    if (!this.userId) {
      console.error('User ID not found in local storage');
      return;
    }

    const apiUrl = `${environment.apiUrl}/profiles/${this.userId}`;
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        this.profiles = response.sort((a: any, b: any) =>
          a.profile_name.localeCompare(b.profile_name)
        );
        const activeProfile = this.profiles.find((profile) => profile.is_active);
        if (activeProfile) {
          localStorage.setItem('active_profile', activeProfile.profile_id);
        }
      },
      error: (err) => {
        console.error('Failed to fetch profiles:', err);
      },
    });
  }

  openAddProfileDialog(): void {
    this.isEditMode = false;
    this.currentProfile = { profile_name: '', dietary_preferences: { vegetarian: false, vegan: false, allergies: [] } };
    this.showDialog = true;
  }

  editProfile(profile: any): void {
    this.isEditMode = true;
    this.currentProfile = { ...profile };
    this.showDialog = true;
  }

  saveProfile(): void {
    if (!this.userId) {
      console.error('User ID not found in local storage');
      return;
    }

    const apiUrl = this.isEditMode
      ? `${environment.apiUrl}/profiles/${this.currentProfile.profile_id}`
      : `${environment.apiUrl}/profiles/`;

    const payload = {
      ...this.currentProfile,
      user_id: this.userId,
    };

    const method = this.isEditMode ? 'put' : 'post';

    this.http[method](apiUrl, payload).subscribe({
      next: () => {
        alert(`Profile ${this.isEditMode ? 'updated' : 'added'} successfully!`);
        this.showDialog = false;
        this.fetchProfiles();
      },
      error: (err) => {
        console.error(`Failed to ${this.isEditMode ? 'update' : 'add'} profile:`, err);
        alert('Failed to save profile.');
      },
    });
  }

  deleteProfile(profileId: string): void {
    const apiUrl = `${environment.apiUrl}/profiles/${profileId}`;
    this.http.delete(apiUrl).subscribe({
      next: () => {
        alert('Profile deleted successfully!');
        this.showDialog = false;
        this.fetchProfiles();
      },
      error: (err) => {
        console.error('Failed to delete profile:', err);
        alert('Failed to delete profile.');
      },
    });
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  toggleActiveProfile(profileId: string): void {
    const apiUrl = `${environment.apiUrl}/profiles/${profileId}/activate`;
    this.http.put(apiUrl, {}).subscribe({
      next: () => {
        alert('Active profile updated!');
        this.fetchProfiles();
        // Store the active profile in localStorage
        const activeProfile = this.profiles.find((profile) => profile.profile_id === profileId);
        if (activeProfile) {
          localStorage.setItem('active_profile', activeProfile.profile_id);
          console.log(activeProfile);
        }
      },
      error: (err) => {
        console.error('Failed to toggle active profile:', err);
        alert('Failed to update active profile.');
      },
    });
  }
}
