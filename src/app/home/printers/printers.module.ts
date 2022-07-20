import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../../_shared/icons.module';
import {OrganisationSelectedGuard} from '../../_services/guards/organisation-selected-guard.service';

import {PrintersComponent} from './printers.component';
import {AllMediatorsComponent} from './all-mediators/all-mediators.component';
import {EventByIdPrintersComponent} from './event-by-id-printers/event-by-id-printers.component';
import {PrinterEditComponent} from './printer-edit/printer-edit.component';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';

const startRoutes: Routes = [
  {
    path: '',
    component: PrintersComponent,
    canActivate: [OrganisationSelectedGuard],
    children: [
      {path: 'mediators', component: AllMediatorsComponent},
      {path: 'event/:id', component: EventByIdPrintersComponent},
      {path: ':id', component: PrinterEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/printers/mediators'},
    ],
  },
];

@NgModule({
  declarations: [PrintersComponent, AllMediatorsComponent, EventByIdPrintersComponent, PrinterEditComponent],
  imports: [
    CommonModule,
    DfxTranslateModule,
    RouterModule.forChild(startRoutes),
    FlexLayoutModule,
    FormsModule,
    IconsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    NgbNavModule,
  ],
})
export class PrintersModule {}
