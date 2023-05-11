import { ValidatorFn, AbstractControl } from '@angular/forms';
import { Type } from '../types';

export function typeValidator(types: Type[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedLType = control.value as Type;

    let isValid = !(
      !selectedLType ||
      selectedLType.title === '' ||
      selectedLType.description === ''
    );

    if (isValid) {
      isValid = !!types.find((type) => {
        return (
          type.key === selectedLType.key &&
          type.title === selectedLType.title &&
          type.description === selectedLType.description
        );
      });
    }
    return isValid ? null : { invalidType: { value: control.value } };
  };
}
