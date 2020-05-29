import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { ShapesService } from '../../services/shapes.service';

import { fromEvent, Subscription, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Rectangle } from '../../classes/Shapes';

@Component({
  selector: 'app-draw-rectangles',
  templateUrl: './draw-rectangles.component.html',
  styleUrls: ['./draw-rectangles.component.scss']
})
export class DrawRectanglesComponent implements OnInit, OnDestroy {
  @Input() clearEvents: Observable<void>;
  @Input() color: string;
  @Input() width: number;
  @Input() height: number;

  mouseDownSubs: Subscription;
  eventsClearSubs: Subscription;

  rectangle: Rectangle;
  rectangles: Rectangle[] = [];

  @Output() transferRectangles = new EventEmitter();

  constructor(private shapesService: ShapesService) { }

  clearRectangle() {
    if (!this.rectangle) {
      return;
    }

    this.rectangle.save();
    this.rectangles.push({ ...this.rectangle });
    this.rectangle = null;
  }

  captureEvents({ canvasEl, ctx, width, height }) {
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

          this.rectangle = this.shapesService.createRectangle(pos, 0, 0, this.color);
    
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

        this.rectangle.draw(pos, ctx, width, height);
  
        // draw all rectangles drawn before since we cleared the canvas
        this.rectangles.forEach((rectangle) => {
          // temporarily update the canvas to use the rectangle color
          if (rectangle.color !== this.color) {
            ctx.strokeStyle = rectangle.color;
          }
          rectangle.drawEntireShape(ctx);
        });
        // update canvas color to current color
        ctx.strokeStyle = this.color;
      });
  }

  ngOnInit(){
    this.eventsClearSubs = this.clearEvents.subscribe(() => {
      this.rectangles = [];
    });
  }

  ngOnDestroy() {
    this.transferRectangles.emit(this.rectangles);
    this.mouseDownSubs.unsubscribe();
    this.eventsClearSubs.unsubscribe();
  }
}
