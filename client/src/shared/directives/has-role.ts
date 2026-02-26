import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../core/services/account-service.service';

@Directive({
  selector: '[appHasRole]'})
export class HasRole implements OnInit {
  @Input() appHasRole: string[] = [];
  private accountService = inject(AccountService);
  //for creating a view container
  private viewContainerRef = inject(ViewContainerRef);
  //for accessing the template reference
  private templateRef = inject(TemplateRef);

  ngOnInit(): void {
    if (this.accountService.currentUser()?.roles.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
