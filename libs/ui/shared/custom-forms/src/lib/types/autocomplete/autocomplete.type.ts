import { ChangeDetectionStrategy, Component, OnInit, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';
import { debounceTime, iif, Observable, of, startWith, switchMap } from 'rxjs';

interface AutocompleteProps extends FormlyFieldProps {
  filter: (term: string) => Observable<string[]>;
}

export interface FormlyAutocompleteFieldConfig extends FormlyFieldConfig<AutocompleteProps> {
  type: 'autocomplete' | Type<FormlyFieldAutocomplete>;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'formly-field-autocomplete',
  template: `
    <input
      matInput
      [id]="id"
      [type]="props.type || 'text'"
      [readonly]="props.readonly"
      [required]="required"
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [tabIndex]="props.tabindex"
      [matAutocomplete]="auto"
      [placeholder]="props.placeholder || ''"
    />
    <mat-autocomplete #auto="matAutocomplete">
      <mat-option *ngFor="let value of filter | async" [value]="value">
        {{ value }}
      </mat-option>
    </mat-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class FormlyFieldAutocomplete extends FieldType<FieldTypeConfig<AutocompleteProps>> implements OnInit {
  filter!: Observable<string[]>;

  ngOnInit() {
    this.filter = this.formControl.valueChanges.pipe(
      debounceTime(250),
      startWith(''),
      switchMap((term: string) => iif(() => !!term?.length, this.props.filter(term), of([]))),
    );
  }
}
