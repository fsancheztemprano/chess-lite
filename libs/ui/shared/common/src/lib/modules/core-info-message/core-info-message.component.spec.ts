import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreInfoMessageComponent } from './core-info-message.component';

describe('CoreInfoMessageComponent', () => {
  let component: CoreInfoMessageComponent;
  let fixture: ComponentFixture<CoreInfoMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreInfoMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreInfoMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
