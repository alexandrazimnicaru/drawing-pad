import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerLibComponent } from './color-picker-lib.component';

describe('ColorPickerLibComponent', () => {
  let component: ColorPickerLibComponent;
  let fixture: ComponentFixture<ColorPickerLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
