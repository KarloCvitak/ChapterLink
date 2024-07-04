import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationGuard} from "./auth/auth.guard";
import {FeedComponent} from "./feed/feed.component";
import {SearchResultsComponent} from "./search-results/search-results.component";

const routes: Routes = [
  { path: '', component: FeedComponent, canActivate: [AuthenticationGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'search', component: SearchResultsComponent, canActivate: [AuthenticationGuard] },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
