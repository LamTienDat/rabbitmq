import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';

@Schema()
export class PaginateDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  search?: string;

  @ApiProperty({ type: Number, default: 1 })
  @IsOptional()
  @IsPositive()
  @Min(1)
  page: number;

  @ApiProperty({ type: Number, default: 10 })
  @IsOptional()
  @IsPositive()
  limit: number;
}
