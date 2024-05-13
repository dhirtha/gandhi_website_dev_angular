import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CartComponent } from './cart.component';
import {ConfirmationComponent} from '../fullPartialConfirmation/confirmation.component';

export const routes = [
  { path: '', component: CartComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    CartComponent,
    ConfirmationComponent
  ],
  providers: [
      DatePipe
  ]
})
export class CartModule { }
