import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Template } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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

export function setFormValidatorsPipe(
  formGroup: FormGroup
): (observable: Observable<Template | null>) => Observable<null> {
  return (observable: Observable<Template | null>) => {
    return observable.pipe(
      tap((template) => {
        for (const control in formGroup.controls) {
          const propertyValidators = getPropertyValidators(template, control);
          if (propertyValidators.length) {
            formGroup.controls[control]?.setValidators(propertyValidators);
          }
        }
        formGroup.updateValueAndValidity();
      }),
      map(() => null)
    );
  };
}

export function matchingControlsValidators(
  controlName: string,
  matchingControlName: string
): (control: AbstractControl) => ValidationErrors | null {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    return control && matchingControl && control.value === matchingControl.value ? null : { mustMatch: true };
  };
}
