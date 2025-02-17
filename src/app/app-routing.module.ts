import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationGuard} from "./auth/auth.guard";
import {FeedComponent} from "./components/user-components/feed/feed.component";
import {SearchResultsComponent} from "./components/user-components/search-results/search-results.component";
import {BookDetailComponent} from "./components/user-components/book-detail/book-detail.component";
import {ProfileComponent} from "./components/user-components/profile/profile.component";
import {CriticDetailsComponent} from "./components/user-components/critic-details/critic-details.component";
import {CreatingListComponent} from "./components/user-components/creating-list/creating-list.component";
import {CustomListsService} from "./services/portal-services/custom-lists.service";
import {CustomListsComponent} from "./components/user-components/custom-lists/custom-lists.component";
import {UserRoleDashboardComponent} from "./components/admin-components/user-role-dashboard/user-role-dashboard.component";

const routes: Routes = [
  { path: '', component: FeedComponent, canActivate: [AuthenticationGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'search', component: SearchResultsComponent, canActivate: [AuthenticationGuard] },
  { path: 'book/:id', component: BookDetailComponent, canActivate: [AuthenticationGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'profile', redirectTo: '/profile/default', pathMatch: 'full' },
  { path: 'profile/default', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'review/:id', component: CriticDetailsComponent,canActivate: [AuthenticationGuard] },
  { path: 'create-list', component: CreatingListComponent, canActivate: [AuthenticationGuard]  },
  { path: 'custom-lists/:id', component: CustomListsComponent, canActivate: [AuthenticationGuard]  },
  { path: 'user-role-dashboard', component: UserRoleDashboardComponent, canActivate: [AuthenticationGuard]  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
