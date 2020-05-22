import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { ShapesService } from '../../services/shapes.service';

import { fromEvent, Subscription, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Circle } from '../../classes/Shapes';

@Component({
  selector: 'app-draw-circles',
  templateUrl: './draw-circles.component.html',
  styleUrls: ['./draw-circles.component.scss']
})
export class DrawCirclesComponent implements OnInit, OnDestroy {
  @Input() clearEvents: Observable<void>;
  @Input() color: string;

  mouseDownSubs: Subscription;
  eventsClearSubs: Subscription;

  circle: Circle;
  circles: Circle[] = [];

  @Output() transferCircles = new EventEmitter();

  constructor(private shapesService: ShapesService) { }

  clearCircle() {
    if (!this.circle) {
      return;
    }

    this.circle.save();
    this.circles.push({ ...this.circle });
    this.circle = null;
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

          this.circle = this.shapesService.createCircle(pos, 0, this.color);
    
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

        this.circle.draw(pos, ctx, width, height);
  
        // draw all circles drawn before since we cleared the canvas
        this.circles.forEach((circle) => {
          // temporarily update the canvas to use the circle color
          if (circle.color !== this.color) {
            ctx.strokeStyle = circle.color;
          }
          circle.drawEntireShape(ctx);
        });
        // update canvas color to current color
        ctx.strokeStyle = this.color;
      });
  }

  ngOnInit(){
    this.eventsClearSubs = this.clearEvents.subscribe(() => {
      this.circles = [];
    });
  }

  ngOnDestroy() {
    this.transferCircles.emit(this.circles);
    this.mouseDownSubs.unsubscribe();
    this.eventsClearSubs.unsubscribe();
  }
}
