import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class InputDataDto {
  @ApiProperty({ type: String, example: 'abc', required: true })
  key: string;

  @ApiProperty({ type: String, example: 'John Doe', required: true })
  @IsString()
  name: string;

  @ApiProperty({ type: Number, example: 25, required: true })
  @IsNumber()
  age: number;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
    required: true,
  })
  @IsString()
  email: string;

  @ApiProperty({ type: Boolean, example: true, required: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ type: Date, example: '2024-07-29', required: true })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: String, example: '123 Main St', required: true })
  @IsString()
  address: string;

  @ApiProperty({ type: String, example: 'New York', required: true })
  @IsString()
  city: string;

  @ApiProperty({ type: String, example: 'NY', required: true })
  @IsString()
  state: string;

  @ApiProperty({ type: String, example: '10001', required: true })
  @IsNumber()
  zipCode: string;

  @ApiProperty({ type: String, example: 'USA', required: true })
  @IsString()
  country: string;

  @ApiProperty({ type: String, example: 'Developer', required: true })
  @IsString()
  occupation: string;

  @ApiProperty({ type: String, example: 'ABC Corp', required: true })
  @IsString()
  company: string;
}
