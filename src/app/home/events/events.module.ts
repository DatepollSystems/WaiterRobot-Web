import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbDatepickerModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {OrganisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard.service';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

import {IconsModule} from '../../_shared/ui/icons.module';
import {AppSelectableButtonComponent} from '../../_shared/ui/app-selectable-button.component';
import {AllEventsComponent} from './all-events/all-events.component';
import {EventEditComponent} from './event-edit/event-edit.component';

import {EventsComponent} from './events.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';

const startRoutes: Routes = [
  {
    path: '',
    canActivate: [OrganisationSelectedGuard],
    component: EventsComponent,
    children: [
      {path: 'all', component: AllEventsComponent},
      {path: ':id', component: EventEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/events/all'},
    ],
  },
];

@NgModule({
  declarations: [EventsComponent, AllEventsComponent, EventEditComponent],
  imports: [
    RouterModule.forChild(startRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DfxTrackByModule,
    DfxTranslateModule,
    NgbNavModule,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    IconsModule,
    NgbDatepickerModule,
    AppSelectableButtonComponent,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
  ],
})
export class EventsModule {}
