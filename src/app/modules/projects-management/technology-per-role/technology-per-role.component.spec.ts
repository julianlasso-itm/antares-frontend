import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyPerRoleComponent } from './technology-per-role.component';

describe('TechnologyPerRoleComponent', () => {
  let component: TechnologyPerRoleComponent;
  let fixture: ComponentFixture<TechnologyPerRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyPerRoleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyPerRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
