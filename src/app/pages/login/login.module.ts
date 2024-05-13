import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import {LoginProvider} from './login-provider';
import { NgxCaptchaModule } from 'ngx-captcha';
import {ForgotPasswordModule} from './forgot-password.module';

export const routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxCaptchaModule,
    ForgotPasswordModule
  ],
  declarations: [
    LoginComponent
  ],
    providers:[LoginProvider],
})
export class LoginModule { }
