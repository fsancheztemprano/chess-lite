import { FormGroup } from '@angular/forms';
import { Template } from '@chess-lite/hal-form-client';
import { getPropertyValidators } from './get-property.validators';

export function setTemplateValidators(formGroup: FormGroup, template: Template | null | undefined) {
  for (const control in formGroup.controls) {
    const propertyValidators = getPropertyValidators(template, control);
    if (propertyValidators.length) {
      formGroup.controls[control]?.setValidators(propertyValidators);
    }
  }
  formGroup.updateValueAndValidity();
}
