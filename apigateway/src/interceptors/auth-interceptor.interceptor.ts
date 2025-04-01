import {
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  inject,
  BindingScope,
} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import { AuthService } from '../services';

export class AuthInterceptor implements Provider<Interceptor> {
  constructor(
    @inject('services.AuthService') private authService: AuthService,  // Inject AuthService
  ) {}

  value(): Interceptor {
    return async (
      invocationCtx: InvocationContext,
      next: () => ValueOrPromise<InvocationResult>,
    ) => {
      const request = invocationCtx.getSync('rest.http.request') as Request;
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpErrors.Unauthorized('Authorization token missing or invalid');
      }

      const token = authHeader.split(' ')[1];

      try {
        // Verify the token using AuthService
        const user = await this.authService.verifyToken(token);
        invocationCtx.bind('currentUser').to(user); // Bind user data to the context
      } catch (error) {
        throw new HttpErrors.Unauthorized('Invalid or expired token');
      }

      return next();
    };
  }
}
