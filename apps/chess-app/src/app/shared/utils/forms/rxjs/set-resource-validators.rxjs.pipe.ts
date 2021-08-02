import { FormGroup } from '@angular/forms';
import { Resource } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getPropertyValidators } from '../validators/get-property.validators';

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
