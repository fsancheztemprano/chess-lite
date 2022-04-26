import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StubTiledMenuModule } from '@app/ui/shared/common';
import { stubCoreServiceProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientModule } from '@hal-form-client';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StubTiledMenuModule, HalFormClientModule, getTranslocoModule()],
      declarations: [HomeComponent],
      providers: [stubCoreServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
