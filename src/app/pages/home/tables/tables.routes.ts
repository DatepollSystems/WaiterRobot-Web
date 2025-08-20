import {Routes} from '@angular/router';

export const TABLE_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./tables.layout').then((c) => c.TablesLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./tables.page').then((c) => c.TablesPage),
      },
    ],
  },
  {
    path: 't/:id',
    loadComponent: () => import('./table-edit.page').then((c) => c.TableEditPage),
  },
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];

export const TABLE_GROUP_ROUTES: Routes = [
  {
    path: 'all',
    loadComponent: () => import('./table-groups.page').then((c) => c.TableGroupsPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./table-group-edit.page').then((c) => c.TableGroupEditPage),
  },
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];
