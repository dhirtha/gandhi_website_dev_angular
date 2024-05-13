import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ForgotDialogDialog } from './login.component';
import {LoginProvider} from './login-provider';
import { NgxCaptchaModule } from 'ngx-captcha';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgxCaptchaModule
  ],
  declarations: [
    ForgotDialogDialog
  ],
    providers:[LoginProvider],
})
export class ForgotPasswordModule { }
