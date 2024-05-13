import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ResellerComponent } from './reseller.component';
import {ResellerProvider} from './reseller-provider';

export const routes = [
  { path: '', component: ResellerComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ResellerComponent
  ],
    providers:[ResellerProvider]
})
export class ResellerModule { }
