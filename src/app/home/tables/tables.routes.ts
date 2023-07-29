import {Routes} from '@angular/router';
import {eventSelectedGuard} from '../../_shared/services/guards/event-selected-guard';
import {organisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tables.component').then((c) => c.TablesComponent),
    canActivate: [organisationSelectedGuard, eventSelectedGuard],
    children: [
      {
        path: 'all',
        loadComponent: () => import('./all-tables.component').then((c) => c.AllTablesComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: ':id',
        loadComponent: () => import('./table-edit/table-edit.component').then((c) => c.TableEditComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: 'groups/all',
        loadComponent: () => import('./table-groups.component').then((c) => c.TableGroupsComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: 'groups/create',
        loadComponent: () => import('./table-group-edit/table-group-edit.component').then((c) => c.TableGroupEditComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: 'groups/tables/:id',
        loadComponent: () => import('./table-group-by-id-tables.component').then((c) => c.TableGroupByIdTablesComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: 'groups/:id',
        loadComponent: () => import('./table-group-edit/table-group-edit.component').then((c) => c.TableGroupEditComponent),
        canActivate: [eventSelectedGuard],
      },
      {path: '', pathMatch: 'full', redirectTo: '/home/tables/all'},
    ],
  },
];
