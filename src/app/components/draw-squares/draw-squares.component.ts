import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { ShapesService } from '../../services/shapes.service';

import { fromEvent, Subscription, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Square } from '../../classes/Shapes';

@Component({
  selector: 'app-draw-squares',
  templateUrl: './draw-squares.component.html',
  styleUrls: ['./draw-squares.component.scss']
})
export class DrawSquaresComponent implements OnInit, OnDestroy {
  @Input() clearEvents: Observable<void>;
  @Input() color: string;
  @Input() width: number;
  @Input() height: number;

  mouseDownSubs: Subscription;
  eventsClearSubs: Subscription;

  square: Square;
  squares: Square[] = [];

  @Output() transferSquares = new EventEmitter();

  constructor(private shapesService: ShapesService) { }

  clearSquare() {
    if (!this.square) {
      return;
    }

    this.square.save();
    this.squares.push({ ...this.square });
    this.square = null;
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

          this.square = this.shapesService.createSquare(pos, 0, this.color);
    
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

        this.square.draw(pos, ctx, width, height);
  
        // draw all squares drawn before since we cleared the canvas
        this.squares.forEach((square) => {
          // temporarily update the canvas to use the square color
          if (square.color !== this.color) {
            ctx.strokeStyle = square.color;
          }
          square.drawEntireShape(ctx);
        });
        // update canvas color to current color
        ctx.strokeStyle = this.color;
      });
  }

  ngOnInit(){
    this.eventsClearSubs = this.clearEvents.subscribe(() => {
      this.squares = [];
    });
  }

  ngOnDestroy() {
    this.transferSquares.emit(this.squares);
    this.mouseDownSubs.unsubscribe();
    this.eventsClearSubs.unsubscribe();
  }
}
