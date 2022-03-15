import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelPromoComponent } from './excel-promo.component';

describe('ExcelPromoComponent', () => {
  let component: ExcelPromoComponent;
  let fixture: ComponentFixture<ExcelPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelPromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
