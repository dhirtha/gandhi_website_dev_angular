import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ForgotPassComponent } from './forgotPass.component';
import {ForgotPassProvider} from './forgotPass-provider';
import { NgxCaptchaModule } from 'ngx-captcha';

export const routes = [
  { path: '', component: ForgotPassComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxCaptchaModule,
  ],
  declarations: [
    ForgotPassComponent
  ],
    providers:[ForgotPassProvider],
})
export class ForgotPassModule { }
