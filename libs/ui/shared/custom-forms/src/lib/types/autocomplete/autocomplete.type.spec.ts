import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyFieldAutocompleteComponent } from './autocomplete.type';

describe('FormlyFieldAutocompleteComponent', () => {
  let component: FormlyFieldAutocompleteComponent;
  let fixture: ComponentFixture<FormlyFieldAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyFieldAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormlyFieldAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
