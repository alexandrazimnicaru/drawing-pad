import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';

import { Position, Line, Segment, Circle, ShapeInitOptions, Square, Rectangle } from '../classes/Shapes';

import { DEFAULT_COLOR } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ShapesService {
  constructor(private storageService: StorageService) { }

  createShape(init: ShapeInitOptions) {
    if (!init) {
      return null;
    }
  
    if (init.segments && init.segments.length) {
      return this.createLine(init.segments, init.color || DEFAULT_COLOR);
    } else if (init.start && init.radius) {
      return this.createCircle(init.start, init.radius, init.color || DEFAULT_COLOR);
    } else if (init.start && init.side) {
      return this.createSquare(init.start, init.side, init.color || DEFAULT_COLOR);
    } else if (init.start && init.sideX && init.sideY) {
      return this.createRectangle(init.start, init.sideX, init.sideY, init.color || DEFAULT_COLOR);
    }
  
    return null;
  }

  createLine(segments: Segment[] = [], color = DEFAULT_COLOR): Line {
    const storage = this.storageService;
    return {
      type: 'line',
      segments,
      color,
      addSegment(prevPos: Position, currentPos: Position) {
        this.segments = this.segments.concat({ start: prevPos, stop: currentPos });
      },
      draw(prevPos: Position, currentPos: Position, ctx) {
        if (!ctx) {
          return;
        }
  
        ctx.beginPath();
        if (prevPos) {
          ctx.moveTo(prevPos.offsetX, prevPos.offsetY);
          ctx.lineTo(currentPos.offsetX, currentPos.offsetY);
          ctx.stroke();
  
          this.addSegment(prevPos, currentPos);
        }
      },
      drawEntireShape(ctx) {
        this.segments.forEach((segment) => {
          this.draw(segment.start, segment.stop, ctx);
        })
      },
      getShapeToSave() {
        return {
          type: this.type,
          segments: this.segments
        }
      },
      save() {
        let saved = storage.getStoredShapes();
        saved = saved.concat([{
          segments: this.segments,
          color: this.color
        }]);
        localStorage.setItem('drawing-pad', JSON.stringify(saved));
      }
    }
  }

  createCircle = function(start: Position, radius: number = 0, color = DEFAULT_COLOR): Circle {
    const storage = this.storageService;
    return {
      type: 'circle',
      color,
      start,
      end: { ...start },
      radius,
      getDistance(p1X, p1Y, p2X, p2Y) {
        return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2))
      },
      draw(currPos: Position, ctx, width: number, height: number) {
        if (!ctx) {
          return;
        }
  
        this.end = currPos;
        this.radius = this.getDistance(start.offsetX, start.offsetY, currPos.offsetX, currPos.offsetY);
        ctx.clearRect(0, 0, width, height);
    
        ctx.beginPath();
        ctx.arc(currPos.offsetX, currPos.offsetY, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
      },
      drawEntireShape(ctx) {
        ctx.beginPath();
        ctx.arc(this.end.offsetX, this.end.offsetY, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
      },
      getShapeToSave() {
        return {
          type: this.type,
          start: this.start,
          end: this.end,
          radius: this.radius
        }
      },
      save() {
        let saved = storage.getStoredShapes();
  
        // we need the end offset to draw the circle in one go 
        saved = saved.concat([{
          start: this.end,
          radius: this.radius,
          color: this.color
        }]);
        localStorage.setItem('drawing-pad', JSON.stringify(saved));
      }
    }
  }

  createSquare = function(start: Position, side: number = 0, color = DEFAULT_COLOR): Square {
    const storage = this.storageService;
    return {
      type: 'square',
      color,
      start,
      end: { ...start },
      side,
      draw(currPos: Position, ctx, width: number, height: number) {
        if (!ctx) {
          return;
        }

        this.end = currPos;
        this.side = Math.abs(this.end.offsetX - this.start.offsetX) * 2;
        ctx.clearRect(0, 0, width, height);
    
        ctx.beginPath();
        ctx.strokeRect(this.start.offsetX - this.side / 2, this.start.offsetY - this.side / 2, this.side, this.side);
        ctx.stroke();
      },
      drawEntireShape(ctx) {
        ctx.beginPath();
        ctx.strokeRect(this.start.offsetX - this.side / 2, this.start.offsetY - this.side / 2, this.side, this.side);
        ctx.stroke();
      },
      getShapeToSave() {
        return {
          type: this.type,
          start: this.start,
          side: this.side
        }
      },
      save() {
        let saved = storage.getStoredShapes();
  
        saved = saved.concat([{
          start: this.start,
          side: this.side,
          color: this.color
        }]);
        localStorage.setItem('drawing-pad', JSON.stringify(saved));
      }
    }
  }

  createRectangle = function(start: Position, sideX: number = 0, sideY: number = 0, color = DEFAULT_COLOR): Rectangle {
    const storage = this.storageService;
    return {
      type: 'square',
      color,
      start,
      end: { ...start },
      sideX,
      sideY,
      draw(currPos: Position, ctx, width: number, height: number) {
        if (!ctx) {
          return;
        }

        this.end = currPos;
        this.sideX = Math.abs(this.end.offsetX - this.start.offsetX) * 2;
        this.sideY = Math.abs(this.end.offsetY - this.start.offsetY) * 2;
        ctx.clearRect(0, 0, width, height);
    
        ctx.beginPath();
        ctx.strokeRect(this.start.offsetX - this.sideX / 2, this.start.offsetY - this.sideY / 2, this.sideX, this.sideY);
        ctx.stroke();
      },
      drawEntireShape(ctx) {
        ctx.beginPath();
        ctx.strokeRect(this.start.offsetX - this.sideX / 2, this.start.offsetY - this.sideY / 2, this.sideX, this.sideY);
        ctx.stroke();
      },
      getShapeToSave() {
        return {
          type: this.type,
          start: this.start,
          sideX: this.sideX,
          sideY: this.sideY
        }
      },
      save() {
        let saved = storage.getStoredShapes();
  
        saved = saved.concat([{
          start: this.start,
          sideX: this.sideX,
          sideY: this.sideY,
          color: this.color
        }]);
        localStorage.setItem('drawing-pad', JSON.stringify(saved));
      }
    }
  }
}
