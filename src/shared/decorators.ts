/* eslint-disable prettier/prettier */
import { createParamDecorator, CustomDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { User } from "@prisma/client";

export const Roles = (...roles: string[]): CustomDecorator<string> =>
  SetMetadata("roles", roles);


export const CurrentUser = createParamDecorator(
(data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest()?.user as User;
  },
);
