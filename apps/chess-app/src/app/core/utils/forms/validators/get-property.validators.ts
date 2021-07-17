import { ValidatorFn, Validators } from '@angular/forms';
import { Template } from '@chess-lite/hal-form-client';

export function getPropertyValidators(template: Template | null, propertyName: string): ValidatorFn[] {
  const property = template?.getProperty(propertyName);
  const usernameValidators = [];
  if (property?.minLength) {
    usernameValidators.push(Validators.minLength(property.minLength));
  }
  if (property?.maxLength) {
    usernameValidators.push(Validators.maxLength(property.maxLength));
  }
  if (property?.type === 'email') {
    usernameValidators.push(Validators.email);
  }
  if (property?.required) {
    usernameValidators.push(Validators.required);
  }
  return usernameValidators;
}
