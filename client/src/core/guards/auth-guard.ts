import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service.service';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast-service.service';
import { catchError, map, of, tap } from 'rxjs';
export const authGuard: CanActivateFn = (route, state) => {
  const accountService=inject(AccountService);
  const toast=inject(ToastService);

  console.log('acc service '+accountService.currentUser());
  if(accountService.currentUser())
  {
    return true;
  }
  else
  {
    toast.error('Authorized Access Only');
    return false;
  }
};
