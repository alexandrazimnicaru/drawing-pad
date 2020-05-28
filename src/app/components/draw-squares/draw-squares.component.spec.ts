import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawSquaresComponent } from './draw-squares.component';

describe('DrawCirclesComponent', () => {
  let component: DrawSquaresComponent;
  let fixture: ComponentFixture<DrawSquaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawSquaresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawSquaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
