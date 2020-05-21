import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasLinesComponent } from './canvas-lines.component';

describe('CanvasLinesComponent', () => {
  let component: CanvasLinesComponent;
  let fixture: ComponentFixture<CanvasLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
