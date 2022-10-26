import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxImplodePipeModule, DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {OrganisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard.service';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {IconsModule} from '../../_shared/ui/icons.module';

import {AllMediatorsComponent} from './all-mediators/all-mediators.component';
import {EventByIdPrintersComponent} from './event-by-id-printers/event-by-id-printers.component';
import {PrinterEditComponent} from './printer-edit/printer-edit.component';
import {PrintersComponent} from './printers.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';

import {MediatorsService} from './_services/mediators.service';
import {PrintersService} from './_services/printers.service';

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
  providers: [MediatorsService, PrintersService],
  imports: [
    CommonModule,
    RouterModule.forChild(startRoutes),
    FlexLayoutModule,
    FormsModule,
    IconsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbNavModule,
    DfxTranslateModule,
    DfxTableModule,
    DfxSortModule,
    DfxTrackByModule,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    DfxImplodePipeModule,
    AppSpinnerRowComponent,
  ],
})
export class PrintersModule {}
