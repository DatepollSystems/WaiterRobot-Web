import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DfxTranslateModule} from 'dfx-translate';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {IconsModule} from '../../_shared/icons.module';
import {SortableHeaderModule} from '../../_shared/table-sortable';

import {WaitersComponent} from './waiters.component';
import {OrganisationWaitersComponent} from './organisation-waiters/organisation-waiters.component';
import {EventByIdWaitersComponent} from './event-by-id-waiters/event-by-id-waiters.component';
import {WaiterEditComponent} from './waiter-edit/waiter-edit.component';
import {WaiterQRCodeModalComponent} from './waiter-qr-code-modal.component';
import {QuestionDialogModule} from '../../_shared/question-dialog/question-dialog.module';
import {BootstrapChipInputModule} from '../../_shared/bootstrap-chip-input/bootstrap-chip-input.module';
import {AppQrCodeModalModule} from '../../_shared/app-qr-code-modal/app-qr-code-modal.module';

const waiterRoutes: Routes = [
  {
    path: '',
    component: WaitersComponent,
    children: [
      {path: 'organisation', component: OrganisationWaitersComponent},
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
    EventByIdWaitersComponent,
    WaiterEditComponent,
    WaiterQRCodeModalComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    DfxTranslateModule,
    NgbTooltipModule,
    IconsModule,
    FormsModule,
    NgbNavModule,
    ReactiveFormsModule,
    SortableHeaderModule,
    QuestionDialogModule,
    RouterModule.forChild(waiterRoutes),
    BootstrapChipInputModule,
    AppQrCodeModalModule,
  ],
})
export class WaitersModule {}
