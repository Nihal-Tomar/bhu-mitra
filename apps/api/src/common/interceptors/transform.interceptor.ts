import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseEnvelope<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseEnvelope<T>> {
    return next.handle().pipe(
      map((result) => {
        // If result is already enveloped, return as is
        if (result && typeof result === 'object' && ('data' in result || 'error' in result)) {
          return result;
        }

        return {
          data: result,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
