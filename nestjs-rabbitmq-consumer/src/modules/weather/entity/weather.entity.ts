import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WeatherData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'varchar', length: 255 })
  state: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'float' })
  temperature: number;

  @Column({ type: 'float' })
  humidity: number;

  @Column({ type: 'float' })
  windSpeed: number;

  @Column({ type: 'varchar', length: 255 })
  weatherCondition: string;

  @Column({ type: 'float' })
  pressure: number;

  @Column({ type: 'boolean' })
  isDaytime: boolean;

  @Column({ type: 'float', nullable: true })
  precipitation: number;
}
