import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

type RequestWithUser = Request & {
  user?: {
    id?: string;
  };
};

type RequestWithSchoolCode = Request & {
  user?: {
    schoolCode?: string;
  };
};

export const UserType = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user?.id;
  },
);
export const SchoolCode = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithSchoolCode>();
    return request.user?.schoolCode;
  },
);
