import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fileTypeValidator(accept: string): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!accept) {
      throw new Error('FileTypeValidator: accepted file type can not be empty');
    }
    if (ctrl.value == null) {
      return null;
    }
    if (!accept.includes(ctrl.value.type)) {
      return {
        fileType: true,
      };
    }
    return null;
  };
}
