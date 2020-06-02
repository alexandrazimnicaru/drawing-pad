import { Component, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ShapesService } from '../../services/shapes.service';

import { fromEvent, Subscription, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Line, Circle, Square, Rectangle } from '../../classes/Shapes';

import { DEFAULT_COLOR, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from '../../constants';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnDestroy {
  @ViewChild('canvas') public canvas: ElementRef;
  @Input() width = DEFAULT_CANVAS_WIDTH;
  @Input() height = DEFAULT_CANVAS_HEIGHT;
  @Input() clearEvents: Observable<void>;
  @Input('color') set color(value: string) {
    this.userStrokeStyle = value;

    if (!this.ctx) {
      return;
    }
    this.ctx.strokeStyle = value;
  }

  @Input() type: 'line' | 'circle' | 'square' | 'rectangle';

  mouseDownSubs: Subscription;
  mouseUpSubs: Subscription;
  mouseLeaveSubs: Subscription;
  eventsClearSubs: Subscription;

  shape: Line | Circle | Square | Rectangle;
  shapes: (Line | Circle | Square | Rectangle)[] = [];

  canvasEl: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasOffsetLeft: number;
  canvasOffsetTop: number;
  userStrokeStyle = DEFAULT_COLOR;

  @Output() transferShapes = new EventEmitter();

  constructor(public shapesService: ShapesService) { }

  clearShape() {
    if (!this.shape) {
      return;
    }

    this.shape.save();
    this.shapes.push({ ...this.shape });
    this.shape = null;
  }

  clearCanvas() {
    if (!this.ctx) {
      return;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.shapes = [];
  }

  captureStartDrawEvents(canvasEl, ctx) {
    if (!canvasEl || !ctx) {
      return;
    }

    const rect = canvasEl.getBoundingClientRect();
    const canvasOffsetLeft = rect.left;
    const canvasOffsetTop = rect.top;

    this.mouseDownSubs = fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((startRes: MouseEvent) => {
          const pos = {
            offsetX: startRes.clientX - canvasOffsetLeft,
            offsetY: startRes.clientY - canvasOffsetTop
          };

          this.shape = this.shapesService.createShape({
            start: pos,
            type: this.type,
            color: this.userStrokeStyle
          });
    
          // after a mouse down, record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // (and unsubscribe) once the user releases the mouse or leaves the canvas
              // this will trigger a 'mouseup' or a 'mouseleave' event    
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
            )
        })
      )
      .subscribe((res: MouseEvent) => {
        const pos = {
          offsetX: res.clientX - canvasOffsetLeft,
          offsetY: res.clientY - canvasOffsetTop
        };

        this.shape.draw(pos, ctx, this.width, this.height);
  
        // draw all circles drawn before since we cleared the canvas
        this.shapes.forEach((shape) => {
          // temporarily update the canvas to use the circle color
          if (shape.color !== this.userStrokeStyle) {
            ctx.strokeStyle = shape.color;
          }
          shape.drawEntireShape(ctx);
        });
        // update canvas color to current color
        ctx.strokeStyle = this.userStrokeStyle;
      });
  }

  captureStopDrawEvents(canvasEl: HTMLCanvasElement) {
    this.mouseUpSubs = fromEvent(canvasEl, 'mouseup').subscribe(() => {
      this.clearShape();
    });

    this.mouseLeaveSubs = fromEvent(canvasEl, 'mouseleave').subscribe(() => {
      this.clearShape();
    });
  }

  ngOnInit(){
    this.eventsClearSubs = this.clearEvents.subscribe(() => {
      this.clearCanvas();
    });
  }

  ngAfterViewInit() {
    this.canvasEl = this.canvas.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.userStrokeStyle;

    this.captureStartDrawEvents(this.canvasEl, this.ctx);
    this.captureStopDrawEvents(this.canvasEl);
  }

  ngOnDestroy() {
    this.transferShapes.emit(this.shapes);
    this.mouseDownSubs.unsubscribe();
    this.mouseUpSubs.unsubscribe();
    this.mouseLeaveSubs.unsubscribe();
    this.eventsClearSubs.unsubscribe();
  }
}
  