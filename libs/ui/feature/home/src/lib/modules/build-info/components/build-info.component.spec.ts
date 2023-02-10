import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from '@app/ui/testing';

import { BuildInfoComponent } from './build-info.component';

describe('BuildInfoComponent', () => {
  let component: BuildInfoComponent;
  let fixture: ComponentFixture<BuildInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule(), RouterTestingModule],
      declarations: [BuildInfoComponent],
    })
      .overrideComponent(BuildInfoComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();

    fixture = TestBed.createComponent(BuildInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render build version', () => {
    component.route.snapshot.data.buildInfo = { version: '1.0.0' };
    fixture.detectChanges();
    const versionElement = fixture.nativeElement.querySelector('span.version');
    expect(versionElement).toBeTruthy();
    expect(versionElement.textContent).toBe('home.build-info.version: 1.0.0');
  });

  it('should render build date', () => {
    component.route.snapshot.data.buildInfo = { date: '23/10/2022' };
    fixture.detectChanges();
    const versionElement = fixture.nativeElement.querySelector('span.date');
    expect(versionElement).toBeTruthy();
    expect(versionElement.textContent).toBe('home.build-info.date: 23/10/2022');
  });

  it('should render build run', () => {
    component.route.snapshot.data.buildInfo = { run: '420-1' };
    fixture.detectChanges();
    const versionElement = fixture.nativeElement.querySelector('span.run');
    expect(versionElement).toBeTruthy();
    expect(versionElement.textContent).toBe('home.build-info.run: 420-1');
  });

  it('should render build branch', () => {
    component.route.snapshot.data.buildInfo = { branch: 'devops/UM-60' };
    fixture.detectChanges();
    const versionElement = fixture.nativeElement.querySelector('span.branch');
    expect(versionElement).toBeTruthy();
    expect(versionElement.textContent).toBe('home.build-info.branch: devops/UM-60');
  });

  it('should render build stage', () => {
    component.route.snapshot.data.buildInfo = { stage: 'feature' };
    fixture.detectChanges();
    const versionElement = fixture.nativeElement.querySelector('span.stage');
    expect(versionElement).toBeTruthy();
    expect(versionElement.textContent).toBe('home.build-info.stage: feature');
  });
});
