import { FormGroup } from '@angular/forms';
import { Resource } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export function patchFormPipe(formGroup: FormGroup): (observable: Observable<Resource>) => Observable<Resource> {
  return (observable: Observable<Resource>) => {
    return observable.pipe(tap((resource) => formGroup.patchValue(resource || {})));
  };
}
