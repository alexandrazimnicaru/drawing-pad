import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasCirclesComponent } from './canvas-circles.component';

describe('CanvasCirclesComponent', () => {
  let component: CanvasCirclesComponent;
  let fixture: ComponentFixture<CanvasCirclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasCirclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
