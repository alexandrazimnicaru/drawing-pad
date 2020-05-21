import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { fromEvent, Subscription , Observable} from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

import { createLine, saveShape } from '../services/shapes';
import { Line, SavedLine } from '../classes/Shapes';

@Component({
  selector: 'app-canvas-lines',
  templateUrl: './canvas-lines.component.html',
  styleUrls: ['./canvas-lines.component.scss']
})
export class CanvasLinesComponent implements AfterViewInit, OnInit, OnDestroy {
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

  linesToTransfer: SavedLine[] = [];
  currentLine: Line;

  @Output() transferLines = new EventEmitter();

  clearLine() {
    if (!this.currentLine) {
      return;
    }
    
    const toSave: SavedLine = {
      type: 'line',
      segments: this.currentLine.segments
    };
    saveShape(toSave);
    this.linesToTransfer.push(toSave);
    this.currentLine = null;
  }

  captureEvents(canvasEl: HTMLCanvasElement) {
    this.mouseDownSubs = fromEvent(canvasEl, 'mousedown')
    .pipe(
      switchMap((e) => {
        this.currentLine = createLine();

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
        offsetX: res[0].clientX - this.canvasOffsetLeft,
        offsetY: res[0].clientY - this.canvasOffsetTop
      };

      const currentPos = {
        offsetX: res[1].clientX - this.canvasOffsetLeft,
        offsetY: res[1].clientY - this.canvasOffsetTop
      };

      this.currentLine.draw(prevPos, currentPos, this.userStrokeStyle, this.ctx);
    });

    this.mouseUpSubs = fromEvent(canvasEl, 'mouseup').subscribe(() => {
      this.clearLine();
    });

    this.mouseLeaveSubs = fromEvent(canvasEl, 'mouseleave').subscribe(() => {
      this.clearLine();
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
    this.transferLines.emit(this.linesToTransfer);

    this.mouseDownSubs.unsubscribe();
    this.mouseUpSubs.unsubscribe();
    this.mouseLeaveSubs.unsubscribe();
    this.eventsClearSubs.unsubscribe();
  }
}
  