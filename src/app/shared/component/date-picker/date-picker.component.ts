import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {

  @Input() placeholder: string;
  @Input() buttons: boolean = false;
  @Input() initYearRange: number = 1900;
  @Input() endYearRange: number = new Date().getFullYear();;


}
