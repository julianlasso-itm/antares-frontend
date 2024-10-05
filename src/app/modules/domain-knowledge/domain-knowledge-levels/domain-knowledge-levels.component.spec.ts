import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainKnowledgeLevelsComponent } from './domain-knowledge-levels.component';

describe('DomainKnowledgeLevelsComponent', () => {
  let component: DomainKnowledgeLevelsComponent;
  let fixture: ComponentFixture<DomainKnowledgeLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainKnowledgeLevelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DomainKnowledgeLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
