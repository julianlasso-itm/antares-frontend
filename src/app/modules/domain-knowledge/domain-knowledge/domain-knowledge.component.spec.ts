import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainKnowledgeComponent } from './domain-knowledge.component';

describe('DomainKnowledgeComponent', () => {
  let component: DomainKnowledgeComponent;
  let fixture: ComponentFixture<DomainKnowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainKnowledgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DomainKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
