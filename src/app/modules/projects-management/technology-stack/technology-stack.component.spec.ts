import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyStackComponent } from './technology-stack.component';

describe('TechnologyStackComponent', () => {
  let component: TechnologyStackComponent;
  let fixture: ComponentFixture<TechnologyStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyStackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
