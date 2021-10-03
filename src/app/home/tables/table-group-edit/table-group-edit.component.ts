import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {TableGroupsService} from '../../../_services/table-groups.service';
import {TableGroupModel} from '../../../_models/table-group.model';
import {EventsService} from '../../../_services/events.service';
import {EventModel} from '../../../_models/event.model';

@Component({
  selector: 'app-table-group-edit',
  templateUrl: './table-group-edit.component.html',
  styleUrls: ['./table-group-edit.component.scss'],
})
export class TableGroupEditComponent extends AbstractModelEditComponent<TableGroupModel> {
  override redirectUrl = '/home/tables/groups/all';

  selectedEvent: EventModel | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    tableGroupsService: TableGroupsService,
    modal: NgbModal,
    private eventsService: EventsService
  ) {
    super(route, router, tableGroupsService, modal);

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(
      this.eventsService.selectedChange.subscribe((event) => {
        this.selectedEvent = event;
      })
    );
  }

  override addCustomAttributesToModel(model: any): any {
    model.event_id = this.selectedEvent?.id;
    return model;
  }
}
