import { LayoutModule } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { stubSessionRepositoryProvider } from '@app/ui/shared/app';
import { IsMobileModule, NgLetModule, SidenavService, stubSidenavServiceProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { BehaviorSubject } from 'rxjs';
import { SidenavComponent } from './sidenav.component';

@Component({ selector: 'app-home-sidenav-item', template: '' })
class StubHomeSidenavItemComponent {}

@Component({ selector: 'app-user-settings-sidenav-item', template: '' })
class StubUserSettingsSidenavItemComponent {}

@Component({ selector: 'app-administration-sidenav-item', template: '' })
class StubAdministrationSidenavItemComponent {}

@Component({ selector: 'app-authentication-sidenav-item', template: '' })
class StubAuthenticationSidenavItemComponent {}

@Component({ selector: 'app-build-info-sidenav-item', template: '' })
class BuildInfoSidenavItemComponent {}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  let sidenavService: SidenavService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidenavComponent,
        StubHomeSidenavItemComponent,
        StubUserSettingsSidenavItemComponent,
        StubAdministrationSidenavItemComponent,
        StubAuthenticationSidenavItemComponent,
        BuildInfoSidenavItemComponent,
      ],
      imports: [
        LayoutModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        IsMobileModule,
        NgLetModule,
        getTranslocoModule(),
        NoopAnimationsModule,
      ],
      providers: [stubSidenavServiceProvider, stubSessionRepositoryProvider],
    }).compileComponents();

    sidenavService = TestBed.inject(SidenavService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should render home sidenav item', () => {
    expect(fixture.nativeElement.querySelector('app-home-sidenav-item')).toBeTruthy();
  });

  it('should render user settings sidenav item', () => {
    expect(fixture.nativeElement.querySelector('app-user-settings-sidenav-item')).toBeTruthy();
  });

  it('should render administration sidenav item', () => {
    expect(fixture.nativeElement.querySelector('app-administration-sidenav-item')).toBeTruthy();
  });

  it('should render authentication sidenav item', () => {
    expect(fixture.nativeElement.querySelector('app-authentication-sidenav-item')).toBeTruthy();
  });

  it('should render build info sidenav item', () => {
    expect(fixture.nativeElement.querySelector('app-build-info-sidenav-item')).toBeTruthy();
  });

  it('should toggle in sidenav service', () => {
    const spy = jest.spyOn(component.sidenavService, 'toggle');
    component.sidenav = {
      get mode(): string {
        return 'over';
      },
    } as never;

    component.toggleSidenav();

    expect(spy).toHaveBeenCalled();
  });

  it.each(['push', 'side'])('should not toggle if mode is %p', (mode) => {
    const spy = jest.spyOn(component.sidenavService, 'toggle');
    component.sidenav = {
      get mode(): string {
        return mode;
      },
    } as never;

    component.toggleSidenav();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should close in sidenav service', () => {
    const toggle = jest.fn();
    component.sidenav = { toggle } as unknown as MatSidenav;
    expect(component.sidenav.toggle).not.toHaveBeenCalled();

    (sidenavService.isOpen$ as unknown as BehaviorSubject<boolean>).next(false);

    expect(component.sidenav.toggle).toHaveBeenCalled();
  });
});
