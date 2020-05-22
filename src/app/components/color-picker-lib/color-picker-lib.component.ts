import { Component, ViewChild, ElementRef, AfterViewInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-color-picker-lib',
  templateUrl: './color-picker-lib.component.html',
  styleUrls: ['./color-picker-lib.component.scss']
})
export class ColorPickerLibComponent implements AfterViewInit{
  @ViewChild('toggleCanvas') toggleCanvas: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  @Input() color = '#000';

  showCanvas = false;
  canvasEl: HTMLCanvasElement;
  toggleCanvasEl: HTMLElement;
  ctx: CanvasRenderingContext2D;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.canvasEl.contains(event.target) &&
      !this.toggleCanvasEl.contains(event.target)) {
      this.close();
    }
  }

  toHex(dec) {
    const hex = dec.toString(16);
    return hex.length === 2 ? hex : '0' + hex;
  }

  pickColor($event) {
    this.color = this.getColor($event);
  }

  toggle() {
    this.showCanvas = !this.showCanvas;
    if (this.showCanvas) {
      this.renderCanvas(); 
    }
  }

  close() {
    this.showCanvas = false;
  }

  getColor(e) {
    const x = e.pageX - this.canvasEl.offsetLeft;
    const y = e.pageY - this.canvasEl.offsetTop;

    const data = this.ctx.getImageData(x, y, 1, 1).data;
    return '#' + this.toHex(data[0]) + this.toHex(data[1]) + this.toHex(data[2]);
  }

  renderCanvas() {
    // Create color gradient
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvasEl.width, 0);
    gradient.addColorStop(0,    "rgb(255,   0,   0)");
    gradient.addColorStop(0.15, "rgb(255,   0, 255)");
    gradient.addColorStop(0.33, "rgb(0,     0, 255)");
    gradient.addColorStop(0.49, "rgb(0,   255, 255)");
    gradient.addColorStop(0.67, "rgb(0,   255,   0)");
    gradient.addColorStop(0.84, "rgb(255, 255,   0)");
    gradient.addColorStop(1,    "rgb(255,   0,   0)");

    // Apply gradient to canvas
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Create semi transparent gradient (white -> trans. -> black)
    const alphaGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasEl.height);
    alphaGradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
    alphaGradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    alphaGradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
    alphaGradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

    // Apply gradient to canvas
    this.ctx.fillStyle = alphaGradient;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  ngAfterViewInit() {
    this.canvasEl = this.canvas.nativeElement;
    this.toggleCanvasEl = this.toggleCanvas.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
  }
}
