import { Component, ViewChild, ElementRef, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

import { getSaved, removeSaved, createLine, createCircle } from '../services/shapes';
import { SavedLine, SavedCircle } from '../classes/shapes';

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
  userStrokeStyle = '#FAD8D6';
  selectedType = 'line';

  clearSubject: Subject<void> = new Subject<void>();

  constructor(private cd: ChangeDetectorRef) { }

  clear() {
    if (!this.ctx) { return; }
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.clearSubject.next();
    removeSaved();
  }

  transferLine(lineToTransfer: SavedLine) {
    const { segments } = lineToTransfer;
    const line = createLine(segments);
    line.drawEntireLine(segments, this.userStrokeStyle, this.ctx);
  }

  transferLines(lines: SavedLine[]) {
    if (!lines || !lines.length) {
      return;
    }

    lines.forEach((line) => {
      this.transferLine(line);
    });
  }

  transferCircle(circleToTransfer: SavedCircle) {
    const { start, end, radius } = circleToTransfer;
    const circle = createCircle(start, radius);
    circle.drawEntireCircle(end, radius, this.ctx);
  }

  transferCircles(circles: SavedCircle[]) {
    if (!circles || !circles.length) {
      return;
    }

    circles.forEach((circle) => {
      this.transferCircle(circle);
    });
  }

  updateColor(color) {
    if (!this.ctx) { return; }

    this.userStrokeStyle = color;
    this.ctx.strokeStyle = color;
  }

  updateShape(type: 'line' | 'circle') {
    this.selectedType = type || 'line';
  }

  initializeCanvas() {
    const saved = getSaved();
    if (!saved || !saved.length) {
      return;
    }

    saved.forEach((shape) => {
      if (shape.type === 'line') {
        this.transferLine(shape);
      } else {
        this.transferCircle(shape);
      }
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

    this.initializeCanvas();
  }
}
