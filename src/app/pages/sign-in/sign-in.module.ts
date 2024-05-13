import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SignInComponent } from './sign-in.component';
import {SignInProvider} from './sign-in-provider';
import { NgOtpInputModule } from  'ng-otp-input';
import {OtpVerificationModule} from '../otp-verification/otp-verification.module';

export const routes = [
  { path: '', component: SignInComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,NgOtpInputModule
  ],
  declarations: [
    SignInComponent
  ],
    providers:[SignInProvider]
})
export class SignInModule { }
