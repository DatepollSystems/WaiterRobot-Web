import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./events.layout').then((c) => c.EventsLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./events.component').then((c) => c.EventsComponent),
      },
    ],
  },
  {path: 'e/:id', loadComponent: () => import('./event-edit/event-edit.component').then((c) => c.EventEditComponent)},
];
