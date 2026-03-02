import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  protected router = inject(Router);
  constructor() {
    this.createToastContainer();
  }
  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end';
      document.body.appendChild(container);
    }
  }
  private CreateToastElement(
    message: string,
    alertClass: string,
    duration = 5000,
    avatar?: string,
    route?: string,
  ) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add(
      'alert',
      alertClass,
      'shadow-lg',
      'flex',
      'items-center',
      'gap-3',
      'cursor-pointer',
    );

    if (route) {
      toast.addEventListener('click', () => this.router.navigateByUrl(route));
    }
    // toast.innerHTML = ` ${avatar ? `<img src=${avatar || './default_user.jpg'} class='w-10 h-10 rounded'` : ''}
    // <span>${message}</span>
    // <button class='ml-4 btn btn-sm btn-ghost'>X</button>
    // `;
    toast.innerHTML = `
  ${
    avatar
      ? `<div class="avatar">

    <img 
      src="${avatar || './default_user.jpg'}" 
      onerror="this.src='./default_user.jpg'"
      class="w-10 h-10 rounded-full object-cover ring-2 ring-base-200"
    /></div>
  `
      : ''
  }

  <div class="flex flex-col">
    <span class="text-sm font-medium leading-tight">
      ${message}
    </span>
  </div>

  <button class="ml-auto btn btn-sm btn-ghost btn-circle">
    ✕
  </button>
`;
    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });
    toastContainer.append(toast);

    setTimeout(() => {
      if (toastContainer.contains(toast)) toastContainer.removeChild(toast);
    }, duration);
  }
  success(message: string, duration?: number, avatar?: string, route?: string) {
    this.CreateToastElement(message, 'alert-success', duration, avatar, route);
  }
  error(message: string, duration?: number, avatar?: string, route?: string) {
    this.CreateToastElement(message, 'alert-error', duration, avatar, route);
  }
  warning(message: string, duration?: number, avatar?: string, route?: string) {
    this.CreateToastElement(message, 'alert-warning', duration, avatar, route);
  }
  info(message: string, duration?: number, avatar?: string, route?: string) {
    this.CreateToastElement(message, 'alert-info', duration, avatar, route);
  }
}
