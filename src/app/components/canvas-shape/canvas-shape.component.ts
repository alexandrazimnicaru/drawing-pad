import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Subscription, Observable, fromEvent } from 'rxjs';

import { DEFAULT_COLOR, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from '../../constants';

@Component({
  selector: 'app-canvas-shape',
  templateUrl: './canvas-shape.component.html',
  styleUrls: ['./canvas-shape.component.scss']
})
export class CanvasShapeComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('canvas') public canvas: ElementRef;
  @Input() width = DEFAULT_CANVAS_WIDTH;
  @Input() height = DEFAULT_CANVAS_HEIGHT;
  @Input() clearEvents: Observable<void>;
  @Input('color') set color(value: string) {
    if (!this.ctx) {
      return;
    }
    this.userStrokeStyle = value;
    this.ctx.strokeStyle = value;
  }

  mouseUpSubs: Subscription;
  mouseLeaveSubs: Subscription;
  eventsClearSubs: Subscription;

  ctx: CanvasRenderingContext2D;
  canvasOffsetLeft: number;
  canvasOffsetTop: number;
  userStrokeStyle = DEFAULT_COLOR;

  @Output() canvasReady = new EventEmitter();
  @Output() shapeDrawn = new EventEmitter();

  clearCanvas() {
    if (!this.ctx) {
      return;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  captureEvents(canvasEl: HTMLCanvasElement) {
    this.mouseUpSubs = fromEvent(canvasEl, 'mouseup').subscribe(() => {
      this.shapeDrawn.emit();
    });

    this.mouseLeaveSubs = fromEvent(canvasEl, 'mouseleave').subscribe(() => {
      this.shapeDrawn.emit();
    });
  }

  ngOnInit(){
    this.eventsClearSubs = this.clearEvents.subscribe(() => {
      this.clearCanvas();
    });
  }

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.userStrokeStyle;

    this.canvasReady.emit({ canvasEl, ctx: this.ctx, width: this.width, height: this.height });
    this.captureEvents(canvasEl);
  }

  ngOnDestroy() {
    this.mouseUpSubs.unsubscribe();
    this.mouseLeaveSubs.unsubscribe();
    this.eventsClearSubs.unsubscribe();
  }
}
