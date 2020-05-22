import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { StorageService } from '../../services/storage.service';
import { ShapesService } from '../../services/shapes.service';

import { Line, Circle } from '../../classes/Shapes';

import { DEFAULT_COLOR } from '../../constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas') public canvas: ElementRef;
  @Input() width = 400;
  @Input() height = 400;

  ctx: CanvasRenderingContext2D;
  canvasOffsetLeft: number;
  canvasOffsetTop: number;
  userStrokeStyle = DEFAULT_COLOR;
  selectedType = 'line';

  clearSubject: Subject<void> = new Subject<void>();

  constructor(
    private storageService: StorageService,
    private shapesService: ShapesService
  ) { }

  clear() {
    if (!this.ctx) {
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.clearSubject.next();
    this.storageService.removeStoredShapes();
  }

  transferShapes(shapes: Line[] | Circle[]) {
    if (!shapes || !shapes.length || !this.ctx) {
      return;
    }

    shapes.forEach((shape) => {
      shape.drawEntireShape(this.ctx);
    });
  }

  updateColor(color) {
    if (!this.ctx) {
      return;
    }

    this.userStrokeStyle = color;
    this.ctx.strokeStyle = color;
  }

  updateShape(type: 'line' | 'circle') {
    this.selectedType = type || 'line';
  }

  drawSavedShapes() {
    const saved = this.storageService.getStoredShapes();
    if (!saved || !saved.length || !this.ctx) {
      return;
    }

    saved.forEach((saved) => {
      const shape = this.shapesService.createShape(saved);
      if (!shape) {
        return;
      }
  
      shape.drawEntireShape(this.ctx);
    });
  }

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.userStrokeStyle;

    const rect = canvasEl.getBoundingClientRect();
    this.canvasOffsetLeft = rect.left;
    this.canvasOffsetTop = rect.top;

    this.drawSavedShapes();
  }
}