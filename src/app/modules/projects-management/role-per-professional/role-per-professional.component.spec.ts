import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePerProfessionalComponent } from './role-per-professional.component';

describe('RolePerProfessionalComponent', () => {
  let component: RolePerProfessionalComponent;
  let fixture: ComponentFixture<RolePerProfessionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePerProfessionalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RolePerProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
