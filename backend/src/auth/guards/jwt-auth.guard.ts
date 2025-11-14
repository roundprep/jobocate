import { Injectable, ExecutionContext, UnauthorizedException, Optional } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AppLoggerService } from '../../common/logger/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Optional() private readonly logger?: AppLoggerService) {
    super();
    if (this.logger) {
      this.logger.setContext('JwtAuthGuard');
    }
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Log token presence
    if (this.logger) {
      if (!authHeader) {
        this.logger.warn('JWT token missing from Authorization header');
      } else if (!authHeader.startsWith('Bearer ')) {
        this.logger.warn('JWT token missing Bearer prefix');
      } else {
        this.logger.debug('JWT token found in request');
      }
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (err) {
      if (this.logger) {
        this.logger.error(`JWT validation error: ${err.message}`, err.stack);
      }
      throw err;
    }

    if (info) {
      if (this.logger) {
        this.logger.warn(`JWT validation info: ${info.message || JSON.stringify(info)}`);
      }
      if (info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      if (info.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not active yet');
      }
      throw new UnauthorizedException('Authentication failed');
    }

    if (!user) {
      if (this.logger) {
        this.logger.warn('JWT validation failed - User not found or token invalid');
      }
      throw new UnauthorizedException('Authentication required');
    }

    if (this.logger) {
      this.logger.debug(`JWT validation successful for user: ${user.email || user._id}`);
    }
    return user;
  }
}

