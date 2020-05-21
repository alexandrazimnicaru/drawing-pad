import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { CanvasCirclesComponent } from './canvas-circles/canvas-circles.component';
import { CanvasLinesComponent } from './canvas-lines/canvas-lines.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ColorPickerComponent,
    CanvasCirclesComponent,
    CanvasLinesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
