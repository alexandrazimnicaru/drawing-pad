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
  color: string;
  draw: Function;
  drawEntireShape: Function;
  getShapeToSave: Function;
  save: Function;
}

export interface ShapeInitOptions {
  type: 'line' | 'circle';
  color: string;
  segments?: Segment[];
  start?: Position;
  radius?: number;
  side?: number;
}

export interface Line extends Shape {
  segments: Segment[];
  addSegment: Function;
}

export interface Circle extends Shape {
  start: Position;
  end: Position | null;
  radius: number;
  getDistance: Function;
}

export interface Square extends Shape {
  start: Position;
  end: Position | null;
  side: number;
}

export interface SavedLine {
  segments: Segment[];
  color: string;
}

export interface SavedCircle {
  start: Position;
  radius: number;
  color: string;
}
export interface SavedSquare {
  start: Position;
  side: number;
  color: string;
}
