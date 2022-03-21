import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';

import {IconsModule} from '../../_shared/icons.module';
import {OrganisationSelectedGuard} from '../../_services/guards/organisation-selected-guard.service';
import {QuestionDialogModule} from '../../_shared/question-dialog/question-dialog.module';
import {NgbEntityChipInputModule} from '../../_shared/ngb-entity-chip-input/ngb-entity-chip-input.module';
import {AppQrCodeModalModule} from '../../_shared/app-qr-code-modal/app-qr-code-modal.module';

import {WaitersComponent} from './waiters.component';
import {OrganisationWaitersComponent} from './organisation-waiters/organisation-waiters.component';
import {EventByIdWaitersComponent} from './event-by-id-waiters/event-by-id-waiters.component';
import {WaiterEditComponent} from './waiter-edit/waiter-edit.component';
import {WaiterCreateQRCodeModalComponent} from './waiter-create-qr-code-modal.component';
import {WaiterSignInQRCodeModalComponent} from './waiter-edit/waiter-sign-in-qr-code-modal.component';
import {DuplicateOrganisationWaitersComponent} from './duplicate-organisation-waiters/duplicate-organisation-waiters.component';
import {WaiterSessionsComponent} from './waiter-edit/waiter-sessions/waiter-sessions.component';

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
    WaiterCreateQRCodeModalComponent,
    WaiterSignInQRCodeModalComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DfxTranslateModule,
    NgbTooltipModule,
    NgbNavModule,
    DfxTableModule,
    DfxSortModule,
    IconsModule,
    NgbEntityChipInputModule,
    AppQrCodeModalModule,
    QuestionDialogModule,
  ],
})
export class WaitersModule {}
