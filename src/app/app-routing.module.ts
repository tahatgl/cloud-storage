import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { GirisComponent } from './components/giris/giris.component';

const redirectLogin = () => redirectUnauthorizedTo(['giris']);
const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLogin} },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'giris', component: GirisComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }