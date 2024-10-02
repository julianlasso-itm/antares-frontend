import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalForFormComponent } from './modal-for-form.component';

describe('ModalForFormComponent', () => {
  let component: ModalForFormComponent;
  let fixture: ComponentFixture<ModalForFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalForFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalForFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
