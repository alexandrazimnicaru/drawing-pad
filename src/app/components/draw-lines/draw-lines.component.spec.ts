import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawLinesComponent } from './draw-lines.component';

describe('CanvasLinesComponent', () => {
  let component: DrawLinesComponent;
  let fixture: ComponentFixture<DrawLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
