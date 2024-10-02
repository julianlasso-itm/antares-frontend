import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapClosureComponent } from './gap-closure.component';

describe('GapClosureComponent', () => {
  let component: GapClosureComponent;
  let fixture: ComponentFixture<GapClosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GapClosureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GapClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
