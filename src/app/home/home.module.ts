import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,

    ConfirmDialogModule
  ]
})
export class HomeModule { }
