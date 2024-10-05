import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationPerLevelComponent } from './configuration-per-level.component';

describe('ConfigurationPerLevelComponent', () => {
  let component: ConfigurationPerLevelComponent;
  let fixture: ComponentFixture<ConfigurationPerLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationPerLevelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationPerLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
