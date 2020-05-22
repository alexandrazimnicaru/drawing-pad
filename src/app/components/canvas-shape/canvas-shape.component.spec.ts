import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasShapeComponent } from './canvas-shape.component';

describe('CanvasShapeComponent', () => {
  let component: CanvasShapeComponent;
  let fixture: ComponentFixture<CanvasShapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasShapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
