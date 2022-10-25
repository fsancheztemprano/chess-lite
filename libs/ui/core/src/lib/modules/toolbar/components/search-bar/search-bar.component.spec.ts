import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgLetModule, SearchService } from '@app/ui/shared/core';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let searchService: SearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatInputModule, NoopAnimationsModule, MatIconModule, NgLetModule],
      declarations: [SearchBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input', () => {
    searchService.showSearchInput = true;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('input[aria-label="Search"]'))).toBeTruthy();
  });

  it('should not render search input if disabled', () => {
    searchService.showSearchInput = false;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('input[aria-label="Search"]'))).toBeFalsy();
  });

  it('should update service on input change', () => {
    const searchTermSpy = jest.spyOn(searchService, 'searchTerm', 'set');
    searchService.showSearchInput = true;

    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('input[aria-label="Search"]'))
      .triggerEventHandler('input', { target: { value: 'test' } });

    expect(searchTermSpy).toHaveBeenCalledWith('test');
  });

  it('should toggle show search input', () => {
    expect(searchService['_showSearchInput$'].value).toBe(false);

    fixture.debugElement.query(By.css('button[type="button"]')).nativeElement.click();

    expect(searchService['_showSearchInput$'].value).toBe(true);

    fixture.debugElement.query(By.css('button[type="button"]')).nativeElement.click();

    expect(searchService['_showSearchInput$'].value).toBe(false);
  });
});
