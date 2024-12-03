import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit {
  recipes: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  searchQuery: string = '';
  cuisineFilter: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes() {
    const apiUrl = `${environment.apiUrl}/recipes?page=${this.currentPage}&limit=10`;
    this.http.get(apiUrl).subscribe((response: any) => {
      this.recipes = response.recipes;
      this.currentPage = response.currentPage;
      this.totalPages = response.totalPages;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchRecipes();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchRecipes();
    }
  }

  filterRecipes() {
    return this.recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (!this.cuisineFilter || recipe.cuisine === this.cuisineFilter)
    );
  }

  viewRecipe(recipeId: number) {
    this.router.navigate(['/recipes', recipeId]);
  }
}
