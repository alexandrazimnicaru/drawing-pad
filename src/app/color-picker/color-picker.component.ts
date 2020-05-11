import {
  Component, Input, Output, EventEmitter,
  ViewChild, ElementRef, AfterViewInit, ViewContainerRef,
  ComponentFactoryResolver, Injector
} from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit {
  @ViewChild('picker') picker: ElementRef;
  @ViewChild('pickerLibContainer', {read: ViewContainerRef}) pickerLibContainer;
  
  @Input() color: string;

  loadPickerLib = false;
  showNativePicker = true;

  @Output() colorUpdated = new EventEmitter();

  constructor(
    private cfr: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  supportsInputTypeColor(el: HTMLInputElement) {
    return el.type === 'color' && el.value !== '!';
  }

  updateColor({ target }) {
    this.color = target.value;
    this.colorUpdated.emit(this.color);
  }
   
  async ngAfterViewInit() {
    const pickerEl = this.picker.nativeElement;
    this.loadPickerLib = !this.supportsInputTypeColor(pickerEl);

    // lazy load color picker library for browsers that don't support input type color
    if (this.loadPickerLib) {
      this.showNativePicker = false;
      const { ColorPickerLibComponent } = await import('../color-picker-lib/color-picker-lib.component');
      const colorPickerLibFactory = this.cfr.resolveComponentFactory(ColorPickerLibComponent);
      console.log(this.pickerLibContainer);
      this.pickerLibContainer.createComponent(colorPickerLibFactory, null, this.injector);
    }
  }
}
