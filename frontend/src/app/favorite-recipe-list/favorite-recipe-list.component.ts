import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-recipe-list',
  templateUrl: './favorite-recipe-list.component.html',
  styleUrls: ['./favorite-recipe-list.component.scss'],
})
export class FavoriteRecipeListComponent implements OnInit {
  favoriteRecipes: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  searchQuery: string = '';
  cuisineFilter: string = '';
  profileId = localStorage.getItem('active_profile');

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchFavoriteRecipes();
  }

  fetchFavoriteRecipes() {
    if (!this.profileId) {
      console.error('Profile ID not found in local storage');
      return;
    }

    const apiUrl = `${environment.apiUrl}/recipes/favorites?profile_id=${this.profileId}&page=${this.currentPage}&limit=10`;
    this.http.get(apiUrl).subscribe((response: any) => {
      this.favoriteRecipes = response.recipes;
      this.currentPage = response.currentPage;
      this.totalPages = response.totalPages;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchFavoriteRecipes();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchFavoriteRecipes();
    }
  }

  filterRecipes() {
    return this.favoriteRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (!this.cuisineFilter || recipe.cuisine === this.cuisineFilter)
    );
  }

  viewRecipe(recipeId: string) {
    this.router.navigate([`/recipes/${recipeId}`]);
  }
}
