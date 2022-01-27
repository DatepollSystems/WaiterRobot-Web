import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbDatepickerModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../../_shared/icons.module';

import {EventsComponent} from './events.component';
import {AllEventsComponent} from './all-events/all-events.component';
import {EventEditComponent} from './event-edit/event-edit.component';
import {SelectableButtonModule} from '../../_shared/selectable-button/selectable-button.module';

const startRoutes: Routes = [
  {
    path: '',
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
    FlexLayoutModule,
    DfxTranslateModule,
    NgbNavModule,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    IconsModule,
    NgbDatepickerModule,
    SelectableButtonModule,
  ],
})
export class EventsModule {}
