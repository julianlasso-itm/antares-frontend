import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeGapNotesComponent } from './knowledge-gap-notes.component';

describe('KnowledgeGapNotesComponent', () => {
  let component: KnowledgeGapNotesComponent;
  let fixture: ComponentFixture<KnowledgeGapNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgeGapNotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeGapNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
