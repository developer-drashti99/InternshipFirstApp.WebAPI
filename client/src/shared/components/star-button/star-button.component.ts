import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  templateUrl: './star-button.component.html',
  styleUrls: ['./star-button.component.css']
})
export class StarButtonComponent {
  disabled=input<boolean>();
  selected=input<boolean>();
  clickEvent=output<Event>();//general purpose Event

  onClick(event:Event):void
  {
    this.clickEvent.emit(event);
  }
}
