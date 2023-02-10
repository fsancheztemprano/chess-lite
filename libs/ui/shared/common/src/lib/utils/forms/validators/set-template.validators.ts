import { AbstractControl, FormGroup } from '@angular/forms';
import { Template } from '@hal-form-client';
import { getPropertyValidators } from './get-property.validators';

export function setTemplateValidator(control: AbstractControl, key: string, template: Template | null | undefined) {
  const propertyValidators = getPropertyValidators(template, key);
  if (propertyValidators.length) {
    control.addValidators(propertyValidators);
  }
}

export function setTemplateValidators(formGroup: FormGroup, template?: Template | null) {
  for (const control in formGroup.controls) {
    setTemplateValidator(formGroup.controls[control], control, template);
  }
  formGroup.updateValueAndValidity({ emitEvent: false });
}
