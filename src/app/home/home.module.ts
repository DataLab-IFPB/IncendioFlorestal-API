import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardModule } from '../dashboard/dashboard.module';
import { TabViewModule } from 'primeng/tabview';

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
