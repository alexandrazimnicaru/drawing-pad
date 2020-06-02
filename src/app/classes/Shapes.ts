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
  save: Function;
}

export interface ShapeInitOptions {
  type: 'line' | 'circle' | 'square' | 'rectangle';
  color: string;
  segments?: Segment[];
  start?: Position;
  radius?: number;
  side?: number;
  sideX?: number;
  sideY?: number;
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

export interface Rectangle extends Shape {
  start: Position;
  end: Position | null;
  sideX: number;
  sideY: number;
}

export interface SavedLine {
  type: string;
  segments: Segment[];
  color: string;
}

export interface SavedCircle {
  type: string;
  start: Position;
  radius: number;
  color: string;
}
export interface SavedSquare {
  type: string;
  start: Position;
  side: number;
  color: string;
}

export interface SavedRectangle {
  type: string;
  start: Position;
  sideX: number;
  sideY: number;
  color: string;
}
