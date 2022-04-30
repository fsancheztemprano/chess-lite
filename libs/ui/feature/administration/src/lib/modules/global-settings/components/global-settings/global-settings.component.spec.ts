import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StubCoreCardViewComponent } from '@app/ui/shared/common';
import { stubCardViewHeaderServiceProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';

import { GlobalSettingsComponent } from './global-settings.component';

describe('GlobalSettingsComponent', () => {
  let component: GlobalSettingsComponent;
  let fixture: ComponentFixture<GlobalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, getTranslocoModule()],
      declarations: [GlobalSettingsComponent, StubCoreCardViewComponent],
      providers: [stubCardViewHeaderServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
