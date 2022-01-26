import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-panel-loader',
  templateUrl: './panel-loader.component.html',
  styleUrls: ['./panel-loader.component.css'],
})
export class PanelLoaderComponent {
  @Input() visible = false;
}
