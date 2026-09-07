import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserSession } from '@bhumitra/types';

export const CurrentUser = createParamDecorator(
  (data: keyof UserSession | undefined, ctx: ExecutionContext): UserSession | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserSession;
    return data && user ? user[data] : user;
  },
);
