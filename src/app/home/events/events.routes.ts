import {Routes} from '@angular/router';
import {OrganisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard.service';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [OrganisationSelectedGuard],
    loadComponent: () => import('./events.component').then((c) => c.EventsComponent),
    children: [
      {path: 'all', loadComponent: () => import('./all-events.component').then((c) => c.AllEventsComponent)},
      {path: ':id', loadComponent: () => import('./event-edit/event-edit.component').then((c) => c.EventEditComponent)},
      {path: '', pathMatch: 'full', redirectTo: '/home/events/all'},
    ],
  },
];
