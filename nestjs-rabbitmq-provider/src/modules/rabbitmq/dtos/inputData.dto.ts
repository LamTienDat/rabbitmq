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
  @ApiProperty({ type: String, example: 'New York', required: true })
  @IsString()
  city: string;

  @ApiProperty({ type: String, example: 'NY', required: true })
  @IsString()
  state: string;

  @ApiProperty({ type: String, example: 'USA', required: true })
  @IsString()
  country: string;

  @ApiProperty({ type: Date, example: '2024-07-29T12:00:00Z', required: true })
  @IsDate()
  timestamp: Date;

  @ApiProperty({ type: Number, example: 25, required: true })
  @IsNumber()
  temperature: number;

  @ApiProperty({ type: Number, example: 80, required: true })
  @IsNumber()
  humidity: number;

  @ApiProperty({ type: Number, example: 10, required: true })
  @IsNumber()
  windSpeed: number;

  @ApiProperty({ type: String, example: 'Clear', required: true })
  @IsString()
  weatherCondition: string;

  @ApiProperty({ type: Number, example: 1013, required: true })
  @IsNumber()
  pressure: number;

  @ApiProperty({ type: Boolean, example: true, required: true })
  @IsBoolean()
  isDaytime: boolean;

  @ApiProperty({ type: Number, example: 0, required: false })
  @IsOptional()
  @IsNumber()
  precipitation: number;
}
