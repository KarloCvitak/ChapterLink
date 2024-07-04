import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export const PasswordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const password = formGroup.get('password');
  const confirmPassword = formGroup.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};
