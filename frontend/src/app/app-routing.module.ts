import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryFormComponent } from './inventory-form/inventory-form.component';
import { FavoriteRecipeListComponent } from './favorite-recipe-list/favorite-recipe-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/:id', component: RecipeDetailsComponent },
  { path: 'profiles', component: ProfileListComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'inventory/add', component: InventoryFormComponent },
  { path: 'favorites', component: FavoriteRecipeListComponent }, // Add this route

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
