import {Routes} from '@angular/router';
import {organisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [organisationSelectedGuard],
    loadComponent: () => import('./events.component').then((c) => c.EventsComponent),
    children: [
      {path: 'all', loadComponent: () => import('./all-events.component').then((c) => c.AllEventsComponent)},
      {path: ':id', loadComponent: () => import('./event-edit/event-edit.component').then((c) => c.EventEditComponent)},
      {path: '', pathMatch: 'full', redirectTo: '/home/events/all'},
    ],
  },
];
