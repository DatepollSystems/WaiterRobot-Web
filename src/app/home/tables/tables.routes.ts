import {Routes} from '@angular/router';

export const TABLE_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./tables.layout').then((c) => c.TablesLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./tables.component').then((c) => c.TablesComponent),
      },
    ],
  },
  {
    path: 't/:id',
    loadComponent: () => import('./table-edit/table-edit.component').then((c) => c.TableEditComponent),
  },
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];

export const TABLE_GROUP_ROUTES: Routes = [
  {
    path: 'all',
    loadComponent: () => import('./table-groups.component').then((c) => c.TableGroupsComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./table-group-edit/table-group-edit.component').then((c) => c.TableGroupEditComponent),
  },
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];
