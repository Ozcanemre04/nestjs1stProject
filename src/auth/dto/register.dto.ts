import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'firstname has to be at between 3 and 20 chars' })
  public firstname: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'lastname has to be at between 3 and 20 chars' })
  public lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsMobilePhone('fr-BE')
  @Length(10, 15, {
    message: 'phone number has to be at between 3 and 20 chars',
  })
  public phone_number: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be at between 3 and 20 chars' })
  public password: string;
}
