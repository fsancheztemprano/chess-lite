import { ValidatorFn, Validators } from '@angular/forms';
import { ITemplateProperty, Template } from '@hal-form-client';

export function getPropertyValidators(template: Template | null | undefined, propertyName: string): ValidatorFn[] {
  const property: ITemplateProperty | undefined = template?.getProperty(propertyName);
  const validators: ValidatorFn[] = [];
  if (property?.minLength) {
    validators.push(Validators.minLength(property.minLength));
  }
  if (property?.maxLength) {
    validators.push(Validators.maxLength(property.maxLength));
  }
  if (property?.type === 'email') {
    validators.push(Validators.email);
  }
  if (property?.required) {
    validators.push(Validators.required);
  }
  return validators;
}
