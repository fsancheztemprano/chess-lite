import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Resource, Template } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

export function setTemplateValidatorsPipe(
  formGroup: FormGroup,
): (observable: Observable<Template | null>) => Observable<Template | null> {
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
    );
  };
}

export function setResourceValidatorsPipe(
  formGroup: FormGroup,
  templateName: string,
): (observable: Observable<Resource>) => Observable<Resource> {
  return (observable: Observable<Resource>) => {
    return observable.pipe(
      tap((resource) => {
        if (resource && resource.isAllowedTo(templateName)) {
          for (const control in formGroup.controls) {
            const propertyValidators = getPropertyValidators(resource.getTemplate(templateName), control);
            if (propertyValidators.length) {
              formGroup.controls[control]?.setValidators(propertyValidators);
            }
          }
          formGroup.updateValueAndValidity();
        }
      }),
    );
  };
}

export function matchingControlsValidators(
  controlName: string,
  matchingControlName: string,
): (control: AbstractControl) => ValidationErrors | null {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    return control && matchingControl && control.value === matchingControl.value
      ? null
      : { mustMatch: { [controlName]: true } };
  };
}

export function patchFormPipe(formGroup: FormGroup): (observable: Observable<Resource>) => Observable<Resource> {
  return (observable: Observable<Resource>) => {
    return observable.pipe(tap((resource) => formGroup.patchValue(resource || {})));
  };
}
