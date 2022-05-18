import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchService, stubSearchServiceProvider } from '@app/ui/shared/core';
import { SubscribeModule } from '@ngneat/subscribe';
import { of } from 'rxjs';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribeModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule, MatIconModule],
      declarations: [SearchBarComponent],
      providers: [stubSearchServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input', () => {
    jest.spyOn(TestBed.inject(SearchService), 'getShowSearchBar$').mockReturnValue(of(true));
    component.showSearchInput = true;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('input[aria-label="Search"]'))).toBeTruthy();
  });

  it('should not render search input if disabled', () => {
    jest.spyOn(TestBed.inject(SearchService), 'getShowSearchBar$').mockReturnValue(of(true));
    component.showSearchInput = false;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('input[aria-label="Search"]'))).toBeFalsy();
  });

  it('should not render search input if toggled', () => {
    component.showSearchInput = true;
    jest.spyOn(TestBed.inject(SearchService), 'getShowSearchBar$').mockReturnValue(of(false));

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('input[aria-label="Search"]'))).toBeFalsy();
  });

  it('should update service on input change', () => {
    jest.spyOn(TestBed.inject(SearchService), 'setSearchTerm');
    component.showSearchInput = true;

    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('input[aria-label="Search"]'))
      .triggerEventHandler('input', { target: { value: 'test' } });

    expect(TestBed.inject(SearchService).setSearchTerm).toHaveBeenCalledWith('test');
  });

  it('should toggle show search input', () => {
    fixture.detectChanges();
    expect(component.showSearchInput).toBe(false);

    fixture.debugElement.query(By.css('button[type="button"]')).nativeElement.click();

    expect(component.showSearchInput).toBe(true);
  });
});
