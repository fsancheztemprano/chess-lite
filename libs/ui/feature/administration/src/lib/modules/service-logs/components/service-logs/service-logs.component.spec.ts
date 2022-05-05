import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StubCoreCardViewComponent } from '@app/ui/shared/common';
import { stubCoreContextMenuServiceProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { stubServiceLogsServiceProvider } from '../../services/service-logs.service.stub';
import { ServiceLogsComponent } from './service-logs.component';

describe('ServiceLogsComponent', () => {
  let component: ServiceLogsComponent;
  let fixture: ComponentFixture<ServiceLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule, getTranslocoModule()],
      declarations: [ServiceLogsComponent, StubCoreCardViewComponent],
      providers: [stubServiceLogsServiceProvider, stubCoreContextMenuServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
