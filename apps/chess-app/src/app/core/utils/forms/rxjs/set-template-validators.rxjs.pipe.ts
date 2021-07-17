import { FormGroup } from '@angular/forms';
import { Template } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getPropertyValidators } from '../validators/get-property.validators';

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
