import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fileSizeValidator(max: number): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    max = Number(max);
    if (isNaN(max)) {
      throw new Error('FileSizeValidator: invalid max file');
    }
    if (!ctrl.value) {
      return null;
    }
    let files: File[] = ctrl.value;
    if (!Array.isArray(ctrl.value)) {
      files = [ctrl.value];
    }
    if (!files.length) {
      return null;
    }
    const add = (a: number, b: number): number => a + b;
    const sumSize = files.map((x) => x.size).reduce(add);
    if (sumSize > max) {
      return {
        maxSize: true,
      };
    }
    return null;
  };
}
