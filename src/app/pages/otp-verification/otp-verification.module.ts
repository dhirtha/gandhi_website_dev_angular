import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { OtpVerificationComponent } from './otp-verification.component';
import { NgOtpInputModule } from 'ng-otp-input';

export const routes = [
  { path: '', component: OtpVerificationComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgOtpInputModule
  ],
  declarations: [
    OtpVerificationComponent
  ],
})
export class OtpVerificationModule { }
