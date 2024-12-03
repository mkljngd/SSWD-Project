import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss'],
})
export class InventoryFormComponent implements OnInit {
  inventoryItem = { id: '', ingredient: '', quantity: 0, unit: '', expiry_date: '' };
  isEditMode = false;
  ingredients: any[] = []; // Store ingredients
  minDate: string = '';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.isEditMode = true;
      this.fetchInventoryItem(itemId);
    } else {
      // Set default expiry date to 10 days from today
      const today = new Date();
      const tenDaysLater = new Date(today);
      tenDaysLater.setDate(today.getDate() + 10);
      this.inventoryItem.expiry_date = tenDaysLater.toISOString().split('T')[0];
    }
    this.fetchIngredients(); // Fetch ingredients
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  fetchInventoryItem(itemId: string): void {
    const apiUrl = `${environment.apiUrl}/inventory/${itemId}`;
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        this.inventoryItem = response;
      },
      error: (err) => {
        console.error('Failed to fetch inventory item:', err);
      },
    });
  }

  fetchIngredients(): void {
    const apiUrl = `${environment.apiUrl}/ingredients`; // Call the API to fetch ingredients
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        this.ingredients = response; // Store the ingredients
      },
      error: (err) => {
        console.error('Failed to fetch ingredients:', err);
      },
    });
  }

  onIngredientChange(): void {
    const selectedIngredient = this.ingredients.find(
      (ingredient) => ingredient.ingredient_id === this.inventoryItem.ingredient
    );
    if (selectedIngredient) {
      this.inventoryItem.unit = selectedIngredient.unit;
    }
  }

  saveInventoryItem(): void {
    const profileId = localStorage.getItem('active_profile'); // Get profile_id from localStorage
    if (!profileId) {
      console.error('Profile ID not found in localStorage');
      alert('Profile ID is required to save inventory items.');
      return;
    }

    const payload = {
      ...this.inventoryItem,
      profile_id: profileId,
      ingredient_id: this.inventoryItem.ingredient,
    };

    const apiUrl = this.isEditMode
      ? `${environment.apiUrl}/inventory/${this.inventoryItem.id}`
      : `${environment.apiUrl}/inventory/`;

    const method = this.isEditMode ? 'put' : 'post';

    this.http[method](apiUrl, payload).subscribe({
      next: () => {
        alert(`Inventory item ${this.isEditMode ? 'updated' : 'added'} successfully!`);
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        console.error(`Failed to ${this.isEditMode ? 'update' : 'add'} inventory item:`, err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/inventory']);
  }
}
