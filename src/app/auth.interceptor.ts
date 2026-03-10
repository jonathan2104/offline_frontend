import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';

import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, finalize, switchMap, take, of} from 'rxjs';
import {AuthService} from './services/auth.service';
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject(null);

  constructor(private _authService: AuthService,private router:Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAuthToken(request)).pipe(
      catchError((requestError: HttpErrorResponse) => {
        if (requestError.status === 401) {
          this._authService.logout();
          this.router.navigateByUrl("/");
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter((result) => result !== null),
              take(1),
              switchMap(() => next.handle(this.addAuthToken(request)))
            );
          } else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);

            return this.refreshAccessToken().pipe(
              switchMap((token) => {
                this.refreshTokenSubject.next(token);
                return next.handle(this.addAuthToken(request));
              }),
              finalize(() => (this.refreshTokenInProgress = false))
            );
          }
        } else if (requestError.status === 422) {
          //console.log('in');
          const errors = requestError.error.errors;
          //console.log(errors);
          return next.handle(this.addAuthToken(request));
        } else {
          return throwError(() => new Error(requestError.message));
        }
      })) as Observable<HttpEvent<any>>;
  }

  private refreshAccessToken(): Observable<any> {
    return of("secret token");
  }

  addAuthToken(request: HttpRequest<any>) {
    const token = this._authService.getToken();
    if (!token) {
      return request;
    }
    return request.clone({
      setHeaders: {
        authorization: `Bearer ${token}`,
      },
    });
  }

}
