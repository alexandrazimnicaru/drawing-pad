export interface Position {
  offsetX: number;
  offsetY: number;
}

export interface Segment {
  start: Position;
  stop: Position;
  color: string;
}

export interface Shape {
  type: string;
  draw: Function;
}

export interface Line extends Shape {
  segments: Segment[];
  addSegment: Function;
  drawEntireLine: Function;
}

export interface Circle extends Shape {
  start: Position;
  end: Position | null;
  radius: number;
  getDistance: Function;
  drawEntireCircle: Function;
}

export interface SavedLine {
  type: 'line';
  segments: Segment[];
}

export interface SavedCircle {
  type: 'circle';
  start: Position;
  end: Position;
  radius: number;
}
