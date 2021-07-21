import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AdministrationHomeComponent } from './administration-home.component';

@Component({ selector: 'chess-lite-administration-sidenav', template: '' })
export class StubAdministrationSidenavComponent {}

describe('AdministrationHomeComponent', () => {
  let component: AdministrationHomeComponent;
  let fixture: ComponentFixture<AdministrationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AdministrationHomeComponent, StubAdministrationSidenavComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
