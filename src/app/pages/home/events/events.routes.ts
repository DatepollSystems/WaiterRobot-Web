import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./events.layout').then((c) => c.EventsLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./events.page').then((c) => c.EventsPage),
      },
    ],
  },
  {
    path: 'e/:id',
    loadComponent: () => import('./event-edit.page').then((c) => c.EventEditPage),
  },
];
