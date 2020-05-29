import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawRectanglesComponent } from './draw-rectangles.component';

describe('DrawCirclesComponent', () => {
  let component: DrawRectanglesComponent;
  let fixture: ComponentFixture<DrawRectanglesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawRectanglesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawRectanglesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
