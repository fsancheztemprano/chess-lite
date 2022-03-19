import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalSettingsGeneralDefaultRoleComponent } from '../default-role/global-settings-general-default-role.component';
import { GlobalSettingsGeneralSignupOpenComponent } from '../signup-open/global-settings-general-signup-open.component';
import { GlobalSettingsGeneralComponent } from './global-settings-general.component';

@Component({ selector: 'app-global-settings-general-default-role', template: '' })
export class StubGlobalSettingsGeneralDefaultRoleComponent
  implements Partial<GlobalSettingsGeneralDefaultRoleComponent> {}

@Component({ selector: 'app-global-settings-general-signup-open', template: '' })
export class StubGlobalSettingsGeneralSignupOpenComponent
  implements Partial<GlobalSettingsGeneralSignupOpenComponent> {}

describe('GlobalSettingsGeneralComponent', () => {
  let component: GlobalSettingsGeneralComponent;
  let fixture: ComponentFixture<GlobalSettingsGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GlobalSettingsGeneralComponent,
        StubGlobalSettingsGeneralDefaultRoleComponent,
        StubGlobalSettingsGeneralSignupOpenComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSettingsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
