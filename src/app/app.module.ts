import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { InputTextareaModule} from 'primeng/inputtextarea';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import {CardModule} from 'primeng/card';
import { ProfileComponent } from './profile/profile.component';
import { Routes,RouterModule} from '@angular/router';
import {MenubarModule} from 'primeng/menubar';
import {FormsModule} from '@angular/forms';
import { ListgroupComponent } from './listgroup/listgroup.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { SigninComponent } from './signin/signin.component';
import {SidebarModule} from 'primeng/sidebar';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import {FileUploadModule} from 'primeng/fileupload';
import { CookieService } from 'ngx-cookie-service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {CheckboxModule} from 'primeng/checkbox';
import {ProgressBarModule} from 'primeng/progressbar';
import {SplitButtonModule} from 'primeng/splitbutton';
import { TapBarFriendComponent } from './tap-bar-friend/tap-bar-friend.component';
import { PoseComponent } from './pose/pose.component';
import { GroupComponent } from './group/group.component';
import {MenuModule} from 'primeng/menu';
import { ProFriendsComponent } from './pro-friends/pro-friends.component';
import { PoseGroupComponent } from './pose-group/pose-group.component';
import { TapBarGroupComponent } from './tap-bar-group/tap-bar-group.component';


const appRoutes: Routes = [
  { path: '*',component: LoginComponent},
  { path: 'home',component: HomeComponent},
  { path: 'profile',component: ProfileComponent},
  { path: 'signin',component: SigninComponent},
  { path: 'group/:id',component: ListgroupComponent},
  { path: 'poseg',component: PoseGroupComponent},
  { path: 'friend/:id',component: ProFriendsComponent},
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    ListgroupComponent,
    SigninComponent,
    NavbarComponent,
    TapBarFriendComponent,
    PoseComponent,
    GroupComponent,
    ProFriendsComponent,
    PoseGroupComponent,
    TapBarGroupComponent
  ],
  imports: [
    MenuModule,
    SplitButtonModule,
    ProgressBarModule,
    CheckboxModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    MenubarModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    InputTextareaModule,
    OverlayPanelModule,
    SidebarModule,
    CalendarModule,
    DialogModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    MatSliderModule,
    FileUploadModule
  ],
  providers: [CookieService ,{provide: LocationStrategy, useClass: HashLocationStrategy} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
