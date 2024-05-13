import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChangePasswordComponent } from './changePassword.component';
import {ChangePasswordProvider} from './changePassword-provider';

export const routes = [
  { path: '', component: ChangePasswordComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      ReactiveFormsModule,
      SharedModule,
    ],
    declarations: [
      ChangePasswordComponent
    ],
    providers:[ChangePasswordProvider]
})
export class ChangePasswordModule { }
