import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberDetails } from '../features/member-details/member-details';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';
import { TestErrors } from '../features/test-errors/test-errors';
import { NotFound } from '../shared/errors/not-found/not-found';
import { ServerError } from '../shared/errors/server-error/server-error';
import { Register } from '../features/account/register/register';
import { MemberList } from '../features/member-list/member-list';

export const routes: Routes = [
    { path: '', component: Home },
    {
        path: '',
        children: [
            { path: 'employees', component: MemberList },
            { path: 'employees/:id', component: MemberDetails },
            { path: 'messages', component: Messages },
        ],
        canActivate: [authGuard]
    },
    { path: 'errors', component: TestErrors },
    { path: 'server-error', component: ServerError },
    { path: '**', component: NotFound },
];
