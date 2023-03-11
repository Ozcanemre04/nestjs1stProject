import { IsMobilePhone, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  public firstname: string;

  @IsString()
  public lastname: string;

  @IsMobilePhone('fr-BE')
  public phone_number: string;
}
