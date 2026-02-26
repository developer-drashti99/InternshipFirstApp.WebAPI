import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.css']
})
export class DeleteButtonComponent{
   disabled=input<boolean>();
    selected=input<boolean>();
    clickEvent=output<Event>();//general purpose Event
  
    onClick(event:Event):void
    {
      this.clickEvent.emit(event);
    }
}
