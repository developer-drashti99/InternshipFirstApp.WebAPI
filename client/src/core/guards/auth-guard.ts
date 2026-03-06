import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account-service.service';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast-service.service';
export const authGuard: CanActivateFn = (route, state) => {
  const accountService=inject(AccountService);
  const router=inject(Router);
  const toast=inject(ToastService);

  console.log('acc service '+accountService.currentUser()?.displayName);
  if(accountService.currentUser())
  {
    return true;
  }
  else
  {
    router.navigateByUrl('/');
    toast.error('Authorized Access Only');
    return false;
  }
};
