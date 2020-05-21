import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { fromEvent, Subscription, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { createCircle, saveShape } from '../services/shapes';
import { Circle, SavedCircle } from '../classes/Shapes';

@Component({
  selector: 'app-canvas-circles',
  templateUrl: './canvas-circles.component.html',
  styleUrls: ['./canvas-circles.component.scss']
})
export class CanvasCirclesComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('canvas') public canvas: ElementRef;
  @Input() width = 400;
  @Input() height = 400;
  @Input() userStrokeStyle = '#FAD8D6';
  @Input() clearEvents: Observable<void>;

  mouseDownSubs: Subscription;
  mouseUpSubs: Subscription;
  mouseLeaveSubs: Subscription;
  eventsClearSubs: Subscription;

  ctx: CanvasRenderingContext2D;
  canvasOffsetLeft: number;
  canvasOffsetTop: number;

  circles: Circle[] = [];
  circlesToTransfer: SavedCircle[] = [];
  currentCircle: Circle;

  @Output() transferCircles = new EventEmitter();

  clearCircle() {
    if (!this.currentCircle) {
      return;
    }

    const toSave: SavedCircle = {
      type: 'circle',
      start: this.currentCircle.start,
      end: this.currentCircle.end,
      radius: this.currentCircle.radius
    };
    saveShape(toSave);
    this.circlesToTransfer.push(toSave);
    this.circles.push(this.currentCircle);
    this.currentCircle = null;
  }

  captureEvents(canvasEl: HTMLCanvasElement) {
    this.mouseDownSubs = fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((startRes: MouseEvent) => {
          const pos = {
            offsetX: startRes.clientX - this.canvasOffsetLeft,
            offsetY: startRes.clientY - this.canvasOffsetTop
          };
          this.currentCircle = createCircle(pos);
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
          offsetX: res.clientX - this.canvasOffsetLeft,
          offsetY: res.clientY - this.canvasOffsetTop
        };

        this.currentCircle.draw(pos, this.ctx, this.width, this.height);
  
        // draw all circles drawn before since we cleared the canvas
        this.circles.forEach((circle) => {
          circle.drawEntireCircle(circle.end, circle.radius, this.ctx);
        });
      });


    this.mouseUpSubs = fromEvent(canvasEl, 'mouseup').subscribe(() => {
      this.clearCircle();
    });

    this.mouseLeaveSubs = fromEvent(canvasEl, 'mouseleave').subscribe(() => {
      this.clearCircle();
    });
  }

  clearCanvas() {
    if (!this.ctx) { return; }
    this.ctx.clearRect(0, 0, this.width, this.height);
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

    const rect = canvasEl.getBoundingClientRect();
    this.canvasOffsetLeft = rect.left;
    this.canvasOffsetTop = rect.top;

    this.captureEvents(canvasEl);
  }

  ngOnDestroy() {
    this.transferCircles.emit(this.circlesToTransfer);

    this.mouseDownSubs.unsubscribe();
    this.mouseUpSubs.unsubscribe();
    this.mouseLeaveSubs.unsubscribe();
    this.eventsClearSubs.unsubscribe();
  }
}
