import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.fetchRecipeDetails(recipeId);
    } else {
      this.errorMessage = 'Recipe not found';
    }
  }

  fetchRecipeDetails(recipeId: string) {
    const profileId = localStorage.getItem('active_profile');
    const apiUrl = `${environment.apiUrl}/recipes/${recipeId}?profile_id=${profileId}`;
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        this.recipe = response;
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch recipe details. Please try again.';
      },
    });
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  addToFavorites() {
    const profileId = localStorage.getItem('active_profile');
    console.log("prof", profileId)
    const apiUrl = `${environment.apiUrl}/recipes/favorites`;

    this.http.post(apiUrl, { profile_id: profileId, recipe_id: this.recipe.recipe_id }).subscribe({
      next: () => {
        alert('Recipe added to favorites!');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add recipe to favorites.');
      },
    });
  }

toggleFavorite() {
  const profileId = localStorage.getItem('active_profile');
  const apiUrl = `${environment.apiUrl}/recipes/favorites`;

  if (this.recipe.is_favorite) {
    // Remove from favorites
    this.http.delete(apiUrl, {
      body: { profile_id: profileId, recipe_id: this.recipe.recipe_id },
    }).subscribe({
      next: () => {
        this.recipe.is_favorite = false;
        alert('Recipe removed from favorites!');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to remove recipe from favorites.');
      },
    });
  } else {
    // Add to favorites
    this.http.post(apiUrl, { profile_id: profileId, recipe_id: this.recipe.recipe_id }).subscribe({
      next: () => {
        this.recipe.is_favorite = true;
        alert('Recipe added to favorites!');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add recipe to favorites.');
      },
    });
  }
}

}
