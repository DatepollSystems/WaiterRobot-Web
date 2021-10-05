import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../../_helper/icons.module';
import {SortableHeaderModule} from '../../_helper/table-sortable';

import {EventsComponent} from './events.component';
import {AllEventsComponent} from './all-events/all-events.component';
import {EventEditComponent} from './event-edit/event-edit.component';

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
    CommonModule,
    DfxTranslateModule,
    RouterModule.forChild(startRoutes),
    FlexLayoutModule,
    SortableHeaderModule,
    IconsModule,
    NgbNavModule,
    FormsModule,
    NgbTooltipModule,
    ReactiveFormsModule,
  ],
})
export class EventsModule {}
