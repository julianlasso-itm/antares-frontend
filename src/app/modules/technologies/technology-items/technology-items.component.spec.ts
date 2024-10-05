import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyItemsComponent } from './technology-items.component';

describe('TechnologyItemsComponent', () => {
  let component: TechnologyItemsComponent;
  let fixture: ComponentFixture<TechnologyItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
