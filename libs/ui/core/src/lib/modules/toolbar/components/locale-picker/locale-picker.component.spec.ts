import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { stubLocalizationRepositoryProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { Iso3166Pipe } from '../../pipes/iso3166.pipe';
import { LocalePickerComponent } from './locale-picker.component';

describe('LocalePickerComponent', () => {
  let component: LocalePickerComponent;
  let fixture: ComponentFixture<LocalePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMenuModule, MatButtonModule, getTranslocoModule()],
      declarations: [LocalePickerComponent, Iso3166Pipe],
      providers: [stubLocalizationRepositoryProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
