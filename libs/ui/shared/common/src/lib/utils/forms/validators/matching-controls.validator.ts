import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchingControlsValidators(
  controlName: string,
  matchingControlName: string,
): (control: AbstractControl) => ValidationErrors | null {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    return control && matchingControl && control.value === matchingControl.value
      ? null
      : { mustMatch: { [matchingControlName]: true } };
  };
}
