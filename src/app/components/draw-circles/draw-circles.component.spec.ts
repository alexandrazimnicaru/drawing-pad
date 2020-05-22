import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawCirclesComponent } from './draw-circles.component';

describe('DrawCirclesComponent', () => {
  let component: DrawCirclesComponent;
  let fixture: ComponentFixture<DrawCirclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawCirclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
