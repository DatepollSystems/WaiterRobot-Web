import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbDatepickerModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTrackByModule, NgSub} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {OrganisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard.service';
import {AppBtnModelEditConfirmComponent} from '../../_shared/ui/app-btn-model-edit-confirm.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppSelectableButtonComponent} from '../../_shared/ui/app-selectable-button.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';

import {AppIconsModule} from '../../_shared/ui/icons.module';
import {BtnWaiterCreateQrCodeComponenteee} from '../waiters/_shared/btn-waiter-create-qr-code.component';
import {AllEventsComponent} from './all-events/all-events.component';
import {EventEditComponent} from './event-edit/event-edit.component';

import {EventsComponent} from './events.component';

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
    AppIconsModule,
    NgbDatepickerModule,
    AppSelectableButtonComponent,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppBtnModelEditConfirmComponent,
    BtnWaiterCreateQrCodeComponenteee,
    NgSub,
  ],
})
export class EventsModule {}
