import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PasswordChangeDto {
  @IsString()
  public token: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be at between 3 and 20 chars' })
  public password: string;
}
