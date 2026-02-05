import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberDetails } from '../features/members/member-details/member-details';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';
import { TestErrors } from '../features/test-errors/test-errors';
import { NotFound } from '../shared/errors/not-found/not-found';
import { ServerError } from '../shared/errors/server-error/server-error';
import { MemberList } from '../features/members/member-list/member-list';
import { MemberProfileComponent } from '../features/members/member-profile/member-profile.component';
import { MemberMessagesComponent } from '../features/members/member-messages/member-messages.component';
import { MemberPhotosComponent } from '../features/members/member-photos/member-photos.component';
import { memberResolver } from '../features/members/member-resolver';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: '',
    children: [
      { path: 'members', component: MemberList },
      {
        path: 'members/:id', component: MemberDetails,
        resolve: { member: memberResolver },
        runGuardsAndResolvers:'always',
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: MemberProfileComponent, title: 'Profile' },
          { path: 'messages', component: MemberMessagesComponent, title: 'Messages' },
          { path: 'photos', component: MemberPhotosComponent, title: 'Photos' },
        ]
      },
      { path: 'messages', component: Messages },
    ],
    canActivate: [authGuard]
  },
  { path: 'errors', component: TestErrors },
  { path: 'server-error', component: ServerError },
  { path: '**', component: NotFound },
];
