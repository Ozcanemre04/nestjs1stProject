import { IsNumber, IsString } from 'class-validator';

export class CreateAdressDto {
  @IsString()
  public street: string;

  @IsString()
  public city: string;

  @IsString()
  public country: string;

  @IsNumber()
  public zip: number;
}
