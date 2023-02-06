import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxImplodePipe, DfxTrackByModule} from 'dfx-helper';
import {DfxTr, DfxTranslateModule} from 'dfx-translate';

import {OrganisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard.service';
import {AppBtnModelEditConfirmComponent} from '../../_shared/ui/app-btn-model-edit-confirm.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';
import {ChipInput} from '../../_shared/ui/chip-input/chip-input.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {ArrayMapNamePipePipe} from '../../_shared/ui/name-map.pipe';
import {AppBtnQrCodeComponent} from '../../_shared/ui/qr-code/app-btn-qr-code.component';
import {QuestionDialogModule} from '../../_shared/ui/question-dialog/question-dialog.module';
import {DuplicateWaitersService} from './_services/duplicate-waiters.service';
import {WaiterSessionsService} from './_services/waiter-sessions.service';

import {WaitersService} from './_services/waiters.service';
import {BtnWaiterCreateQrCodeComponenteee} from './_shared/btn-waiter-create-qr-code.component';

import {DuplicateOrganisationWaitersComponent} from './duplicate-organisation-waiters/duplicate-organisation-waiters.component';
import {EventByIdWaitersComponent} from './event-by-id-waiters/event-by-id-waiters.component';
import {OrganisationWaitersComponent} from './organisation-waiters/organisation-waiters.component';
import {BtnWaiterSignInQrCodeComponent} from './waiter-edit/btn-waiter-sign-in-qr-code.component';
import {WaiterEditComponent} from './waiter-edit/waiter-edit.component';
import {WaiterSessionsComponent} from './waiter-edit/waiter-sessions/waiter-sessions.component';
import {WaitersComponent} from './waiters.component';

const routes: Routes = [
  {
    path: '',
    component: WaitersComponent,
    canActivate: [OrganisationSelectedGuard],
    children: [
      {path: 'organisation', component: OrganisationWaitersComponent},
      {path: 'organisation/duplicates', component: DuplicateOrganisationWaitersComponent},
      {path: 'organisation/duplicates/:name', component: DuplicateOrganisationWaitersComponent},
      {path: 'event/:id', component: EventByIdWaitersComponent},
      {path: ':id', component: WaiterEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/waiters/organisation'},
    ],
  },
];

@NgModule({
  declarations: [
    WaitersComponent,
    OrganisationWaitersComponent,
    DuplicateOrganisationWaitersComponent,
    EventByIdWaitersComponent,
    WaiterEditComponent,
    WaiterSessionsComponent,
    BtnWaiterSignInQrCodeComponent,
  ],
  providers: [WaitersService, WaiterSessionsService, DuplicateWaitersService],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbNavModule,
    DfxTrackByModule,
    DfxTranslateModule,
    DfxTableModule,
    DfxSortModule,
    AppIconsModule,
    QuestionDialogModule,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    ChipInput,
    AppSpinnerRowComponent,
    AppBtnModelEditConfirmComponent,
    AppBtnQrCodeComponent,
    BtnWaiterCreateQrCodeComponenteee,
    ArrayMapNamePipePipe,
    DfxImplodePipe,
    DfxTr,
  ],
})
export class WaitersModule {}
