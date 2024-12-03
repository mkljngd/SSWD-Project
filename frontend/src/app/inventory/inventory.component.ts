import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventory: any[] = [];
  profileId = localStorage.getItem('active_profile');

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchInventory();
  }

  fetchInventory(): void {
    const apiUrl = `${environment.apiUrl}/inventory/${this.profileId}`;
    console.log("Calling API, ",apiUrl)
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        this.inventory = response.map((item: any) => ({
          ...item,
          isExpiring: item.expiry_date && new Date(item.expiry_date) < new Date(),
        }));
      },
      error: (err) => {
        console.error('Failed to fetch inventory:', err);
      },
    });
  }

  deleteInventoryItem(itemId: string): void {
    const apiUrl = `${environment.apiUrl}/inventory/${itemId}`;
    this.http.delete(apiUrl).subscribe({
      next: () => {
        alert('Inventory item deleted successfully!');
        this.fetchInventory();
      },
      error: (err) => {
        console.error('Failed to delete inventory item:', err);
      },
    });
  }

  addInventory(): void {
    this.router.navigate(['/inventory/add']);
  }

}
