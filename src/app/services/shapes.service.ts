import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';

import { Position, Line, Segment, Circle, ShapeInitOptions } from '../classes/Shapes';

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
}
