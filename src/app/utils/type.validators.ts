import { ValidatorFn, AbstractControl } from '@angular/forms';
import { Type } from '../types';

export function typeValidator(types: Type[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedType = control.value as Type;

    let isValid = !(
      !selectedType ||
      selectedType.title === '' ||
      selectedType.description === ''
    );

    if (isValid) {
      isValid = !!types.find((type) => {
        return (
          type.key === selectedType.key &&
          type.title === selectedType.title &&
          type.description === selectedType.description
        );
      });
    }
    return isValid ? null : { invalidType: { value: control.value } };
  };
}
