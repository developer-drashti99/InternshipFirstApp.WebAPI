import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service.service';
import { ToastService } from '../services/toast-service.service';

export const adminGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const toast = inject(ToastService);

  const user = accountService.currentUser();

  if (!user) {
    toast.error('You must be logged in');
    return false;
  }

  const allowedRoles = ['Admin', 'Moderator'];

  const hasAccess = user.roles?.some(role =>
    allowedRoles.includes(role)
  );

  if (hasAccess) return true;

  toast.error('You do not have permission to access this page');
  return false;
};
