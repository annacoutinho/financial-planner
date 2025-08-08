import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}

  transform(value: unknown) {
    let data = value;

    // se body chegar como string, tenta virar objeto
    if (typeof value === 'string') {
      try { data = JSON.parse(value); } catch { /* deixa como está */ }
    }

    const parsed = this.schema.safeParse(data);
    if (!parsed.success) {
      const msgs = this.formatErrors(parsed.error);
      throw new BadRequestException(msgs);
    }
    return parsed.data;
  }

  private formatErrors(error: ZodError) {
    return error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
  }
}
