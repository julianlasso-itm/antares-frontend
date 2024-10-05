import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeGapsComponent } from './knowledge-gaps.component';

describe('KnowledgeGapsComponent', () => {
  let component: KnowledgeGapsComponent;
  let fixture: ComponentFixture<KnowledgeGapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgeGapsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeGapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
