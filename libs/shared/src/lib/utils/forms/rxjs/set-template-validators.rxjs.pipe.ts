import { FormGroup } from '@angular/forms';
import { Template } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { setTemplateValidators } from '../validators/set-template.validators';

export function setTemplateValidatorsPipe(
  formGroup: FormGroup,
): (observable: Observable<Template | null>) => Observable<Template | null> {
  return (observable: Observable<Template | null>) => {
    return observable.pipe(
      tap((template) => {
        setTemplateValidators(formGroup, template);
      }),
    );
  };
}
