import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class DateAudit {
  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
