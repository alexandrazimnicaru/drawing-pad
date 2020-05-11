import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit {
  @ViewChild('picker') public colorPicker: ElementRef;
  @Input() color: string;

  @Output() colorUpdated = new EventEmitter();

  supportsInputTypeColor(el: HTMLInputElement) {
    console.log(el.type, el.value);
    return el.type === 'color' && el.value !== '!';
  }

  updateColor({ target }) {
    this.color = target.value;
    this.colorUpdated.emit(this.color);
  }
   
  ngAfterViewInit() {
    const colorPickerEl = this.colorPicker.nativeElement;
    if (!this.supportsInputTypeColor(colorPickerEl)) {
      console.log('no support');
    }
  }
}
