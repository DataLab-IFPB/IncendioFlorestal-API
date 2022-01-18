import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardChartComponent } from './card-chart/card-chart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardInfoComponent } from './card-info/card-info.component';

import { DashboardService } from './dashboard.service';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


@NgModule({
  providers: [ DashboardService ],
  exports: [ DashboardComponent ],
  declarations: [
    CardChartComponent,
    DashboardComponent,
    CardInfoComponent,
    HeatmapComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    CardModule,
    ChartModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    SharedModule,
    ProgressSpinnerModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
    })
  ]
})

export class DashboardModule { }

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
