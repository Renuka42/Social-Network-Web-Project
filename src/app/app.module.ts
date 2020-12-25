import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import {CardModule} from 'primeng/card';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { ProfileComponent } from './profile/profile.component';
import { Routes,RouterModule} from '@angular/router';
import {MenubarModule} from 'primeng/menubar';
import {FormsModule} from '@angular/forms';
import { ListgroupComponent } from './listgroup/listgroup.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { SigninComponent } from './signin/signin.component';
import {SidebarModule} from 'primeng/sidebar';

const appRoutes: Routes = [
  { path: '',component: LoginComponent},
  { path: 'home/:id',component: HomeComponent},
  { path: 'profile',component: ProfileComponent},
  { path: 'signin',component: SigninComponent},
  { path: 'listgroup',component: ListgroupComponent},
  // 48484848
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    ListgroupComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    InputTextareaModule,
    MenubarModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    OverlayPanelModule,
    SidebarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
