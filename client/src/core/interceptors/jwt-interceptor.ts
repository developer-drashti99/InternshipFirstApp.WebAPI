import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../services/account-service.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService=inject(AccountService);
  const user=accountService.currentUser();

  // modify request but we cannot directly modify it because it's immutable
  // so we will create clone of req if user have value nd then will pass auth token
  // in header
  if(user)
  {
    req=req.clone({
      setHeaders:{
        Authorization:`Bearer ${user.token}`
      }
    });
  }
  return next(req);
};
