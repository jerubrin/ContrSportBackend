import { ApiProperty } from '@nestjs/swagger';

export class UserRes {
  @ApiProperty({
    example: 'test@example.com',
    description: 'E-mail',
  })
  email: string;

  @ApiProperty({
    example: 'Vasya',
    description: "User's first name",
  })
  firstName: string;

  @ApiProperty({
    example: 'Pupkin',
    description: "User's last name",
  })
  lastName: string;

  @ApiProperty({
    example: 'Male',
    description: 'Gender in string format (Male of Female)',
  })
  gender: string;

  @ApiProperty({
    example: '+7',
    description: 'Code of country for phone number',
  })
  countryCode: string;

  @ApiProperty({
    example: '555 55 55',
    description: 'Phone number (without country code)',
  })
  phone: string;

  @ApiProperty({
    example: 'Kazakhstan',
    description: 'User citizenship',
  })
  telegram: string;
}
