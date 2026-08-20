import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from 'src/auth/enums/user-role.enum';

type RequestWithUser = Request & {
  user?: {
    id?: string;
    role?: UserRole;
    schoolCode?: string;
  };
};

type RequestWithSchoolCode = Request & {
  user?: {
    schoolCode?: string;
  };
};

export const UserType = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestWithUser['user'] => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
export const SchoolCode = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithSchoolCode>();
    return request.user?.schoolCode;
  },
);
