import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {path: 'all', loadComponent: () => import('./events.component').then((c) => c.EventsComponent)},
      {path: ':id', loadComponent: () => import('./event-edit/event-edit.component').then((c) => c.EventEditComponent)},
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
