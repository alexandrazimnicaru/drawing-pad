import { Position, Line, Segment, Circle, SavedCircle, SavedLine } from '../classes/Shapes';

export const getSaved = function() {
  const saved = localStorage.getItem('drawing-pad');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed;
    } catch (error) {
      console.log(error);
    }
  }
  return [];
};

export const removeSaved = function() {
  localStorage.removeItem('drawing-pad');
};

export const saveShape = function(toSave: SavedLine | SavedCircle) {
  let saved = getSaved();
  saved = saved.concat([toSave]);
  localStorage.setItem('drawing-pad', JSON.stringify(saved));
};

export const createLine = function(segments: Segment[] = []): Line {
  return {
    type: 'line',
    segments,
    addSegment(prevPos: Position, currentPos: Position, color: string) {
      this.segments = this.segments.concat({
        start: prevPos,
        stop: currentPos, 
        color
      });
    },
    draw(prevPos: Position, currentPos: Position, color: string, ctx) {
      if (!ctx) { return; }

      ctx.beginPath();
      if (prevPos) {
        ctx.moveTo(prevPos.offsetX, prevPos.offsetY);
        ctx.lineTo(currentPos.offsetX, currentPos.offsetY);
        ctx.stroke();

        this.addSegment(prevPos, currentPos, color);
      }
    },
    drawEntireLine(segments: Segment[] = [], color: string, ctx) {
      segments.forEach((segment) => {
        this.draw(segment.start, segment.stop, color, ctx);
      })
    }
  }
};

export const createCircle = function(start: Position, radius: number = 0): Circle {
  return {
    type: 'circle',
    start,
    end: null,
    radius,
    getDistance(p1X, p1Y, p2X, p2Y) {
      return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2))
    },
    draw(currPos: Position, ctx, width: number, height: number) {
      if (!ctx) { return; }

      this.end = currPos;
      this.radius = this.getDistance(start.offsetX, start.offsetY, currPos.offsetX, currPos.offsetY);
      ctx.clearRect(0, 0, width, height);
  
      ctx.beginPath();
      ctx.arc(currPos.offsetX, currPos.offsetY, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
    },
    drawEntireCircle(end: Position, radius: number, ctx) {
      ctx.beginPath();
      ctx.arc(end.offsetX, end.offsetY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
};
