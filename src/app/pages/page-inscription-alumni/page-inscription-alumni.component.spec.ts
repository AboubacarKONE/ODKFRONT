import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInscriptionAlumniComponent } from './page-inscription-alumni.component';

describe('PageInscriptionAlumniComponent', () => {
  let component: PageInscriptionAlumniComponent;
  let fixture: ComponentFixture<PageInscriptionAlumniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageInscriptionAlumniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInscriptionAlumniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
