import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FormErrorComponent } from './form-error.component';

@Component({ selector: 'app-form-error', template: '' })
export class StubFormErrorComponent implements Partial<FormErrorComponent> {
  @Input() control: AbstractControl = new FormControl();
  @Input() name = '';
}
