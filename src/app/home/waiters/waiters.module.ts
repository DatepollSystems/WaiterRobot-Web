import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {QrCodeModule} from 'ng-qrcode';
import {DfxTranslateModule} from 'dfx-translate';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {IconsModule} from '../../_helper/icons.module';
import {SortableHeaderModule} from '../../_helper/table-sortable';

import {WaitersComponent} from './waiters.component';
import {OrganisationWaitersComponent} from './organisation-waiters/organisation-waiters.component';
import {EventByIdWaitersComponent} from './event-by-id-waiters/event-by-id-waiters.component';
import {WaiterEditComponent} from './waiter-edit/waiter-edit.component';
import {WaiterQRCodeModalComponent} from './waiter-qr-code-modal.component';
import {QuestionDialogModule} from '../../_helper/question-dialog/question-dialog.module';
import {BootstrapChipInputModule} from '../../_helper/bootstrap-chip-input/bootstrap-chip-input.module';

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
    QrCodeModule,
    QuestionDialogModule,
    RouterModule.forChild(waiterRoutes),
    BootstrapChipInputModule,
  ],
})
export class WaitersModule {}
