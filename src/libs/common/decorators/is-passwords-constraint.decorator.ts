import { RegisterDto } from '../../../auth/dto/register.dto';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchConstraint
  implements ValidatorConstraintInterface
{
  public validate(
    passwordRepeat: string,
    args: ValidationArguments,
  ): Promise<boolean> | boolean {
    const obj = args.object as RegisterDto;
    return obj.password === passwordRepeat;
  }

  public defaultMessage(validationArguments?: ValidationArguments) {
    return 'пароли не совпадают';
  }
}
