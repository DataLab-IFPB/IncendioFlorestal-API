import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';

import { HomeComponent } from './home/home.component';
import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DashboardModule,
    TabViewModule
  ]
})
export class HomeModule { }
