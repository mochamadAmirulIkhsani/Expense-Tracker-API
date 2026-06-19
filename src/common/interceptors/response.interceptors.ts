import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((res) => {
        let metadata = {};
        let data = res;
        let message = 'success';

        if (res && typeof res === 'object') {
          if ('rows' in res && 'count' in res) {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.per_page) || 10;

            metadata = {
              per_page: perPage,
              current_page: page,
              total_row: res.count,
              total_page: Math.ceil(res.count / perPage),
            };

            data = res.rows;
          }

          if ('data' in res) {
            message = res.message || 'success';
            data = res.data;
          }
        }

        return {
          success: true,
          message,
          errors: null,
          metadata,
          data,
        };
      }),
    );
  }
}