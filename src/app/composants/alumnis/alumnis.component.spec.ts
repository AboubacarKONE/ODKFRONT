import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnisComponent } from './alumnis.component';

describe('AlumnisComponent', () => {
  let component: AlumnisComponent;
  let fixture: ComponentFixture<AlumnisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumnisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
