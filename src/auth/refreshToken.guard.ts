import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../app.decorator';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
}