import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StorageService } from './services/storage.service';
import { ShapesService } from './services/shapes.service';

import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DrawComponent } from './components/draw/draw.component';
import { DrawLinesComponent } from './components/draw-lines/draw-lines.component';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ColorPickerComponent,
    DrawComponent,
    DrawLinesComponent,
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [StorageService, ShapesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
