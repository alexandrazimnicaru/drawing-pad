import { Component } from '@angular/core';

import { ShapesService } from '../../services/shapes.service';

import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

import { DrawComponent } from '../draw/draw.component';

@Component({
  selector: 'app-draw-lines',
  templateUrl: './draw-lines.component.html',
  styleUrls: ['./draw-lines.component.scss']
})
export class DrawLinesComponent extends DrawComponent {
  constructor(shapesService: ShapesService) {
    super(shapesService);
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
      switchMap((e) => {
        this.shape = this.shapesService.createLine([], this.userStrokeStyle);

        // after a mouse down, record all mouse moves
        return fromEvent(canvasEl, 'mousemove')
          .pipe(
            // (and unsubscribe) once the user releases the mouse or leaves the canvas
            // this will trigger a 'mouseup' or a 'mouseleave' event    
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
  
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point    
            pairwise()
          )
      })
    ).subscribe((res: [MouseEvent, MouseEvent]) => {
      const prevPos = {
        offsetX: res[0].clientX - canvasOffsetLeft,
        offsetY: res[0].clientY - canvasOffsetTop
      };

      const currentPos = {
        offsetX: res[1].clientX - canvasOffsetLeft,
        offsetY: res[1].clientY - canvasOffsetTop
      };

      this.shape.draw(prevPos, currentPos, ctx);
    });
  }
}
  