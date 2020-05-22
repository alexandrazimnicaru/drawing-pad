import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StorageService } from './services/storage.service';
import { ShapesService } from './services/shapes.service';

import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { CanvasShapeComponent } from './components/canvas-shape/canvas-shape.component';
import { DrawCirclesComponent } from './components/draw-circles/draw-circles.component';
import { DrawLinesComponent } from './components/draw-lines/draw-lines.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ColorPickerComponent,
    CanvasShapeComponent,
    DrawCirclesComponent,
    DrawLinesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [StorageService, ShapesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
