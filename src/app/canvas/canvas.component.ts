import { Component, ViewChild, ElementRef, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'

declare interface Position {
  offsetX: number;
  offsetY: number;
}

declare interface Segment {
  start: Position;
  stop: Position;
  color: string;
}

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
  userStrokeStyle = '#FAD8D6';
  line: Segment[] = [];
  isPainting = false;

  constructor(private cd: ChangeDetectorRef) { }

  save() {
    localStorage.setItem('drawing-pad-line', JSON.stringify(this.line));
  }

  clear() {
    if (!this.ctx) { return; }

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.line = [];
    localStorage.removeItem('drawing-pad-line');
  }

  updateColor(color) {
    if (!this.ctx) { return; }

    this.userStrokeStyle = color;
    this.ctx.strokeStyle = color;
  }

  captureEvents(canvasEl: HTMLCanvasElement) {
    // capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
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
        const rect = canvasEl.getBoundingClientRect();
  
        // get the previous and current positions
        const prevPos = {
          offsetX: res[0].clientX - rect.left,
          offsetY: res[0].clientY - rect.top
        };
  
        const currentPos = {
          offsetX: res[1].clientX - rect.left,
          offsetY: res[1].clientY - rect.top
        };

        // add them to the line
        this.line = this.line.concat({
          start: prevPos,
          stop: currentPos, 
          color: this.userStrokeStyle
        });

        // do the actual drawing
        this.draw(prevPos, currentPos);
      });

      fromEvent(canvasEl, 'mouseup').subscribe(() => {
        this.save();
      });

      fromEvent(canvasEl, 'mouseleave').subscribe(() => {
        this.save();
      });
  }

  draw(prevPos: Position, currentPos: Position) {
    if (!this.ctx) { return; }

    this.ctx.beginPath();

    if (prevPos) {
      this.ctx.moveTo(prevPos.offsetX, prevPos.offsetY);
      this.ctx.lineTo(currentPos.offsetX, currentPos.offsetY);
      this.ctx.stroke();
    }
  }
  
  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.userStrokeStyle;

    const saved = localStorage.getItem('drawing-pad-line');
    if (saved) {
      try {
        this.line = JSON.parse(saved);
        this.line.forEach((segment) => {
          if (segment.color !== this.userStrokeStyle) {
            this.updateColor(segment.color);
            this.cd.detectChanges();
          }
      
          this.draw(segment.start, segment.stop);
        });
      } catch (error) {
        console.log(error);
      }
    }

    this.captureEvents(canvasEl);
  }
}
