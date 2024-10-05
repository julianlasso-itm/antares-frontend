import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyTypesComponent } from './technology-types.component';

describe('TechnologyTypesComponent', () => {
  let component: TechnologyTypesComponent;
  let fixture: ComponentFixture<TechnologyTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyTypesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
