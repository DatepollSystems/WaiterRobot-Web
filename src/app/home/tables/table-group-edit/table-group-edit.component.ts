import {Component} from '@angular/core';

import {AbstractModelEditComponent} from '../../../_shared/ui/abstract-model-edit.component';
import {EventModel} from '../../events/_models/event.model';
import {EventsService} from '../../events/_services/events.service';
import {TableGroupModel} from '../_models/table-group.model';
import {TableGroupsService} from '../_services/table-groups.service';

@Component({
  selector: 'app-table-group-edit',
  templateUrl: './table-group-edit.component.html',
  styleUrls: ['./table-group-edit.component.scss'],
})
export class TableGroupEditComponent extends AbstractModelEditComponent<TableGroupModel> {
  override redirectUrl = '/home/tables/groups/all';

  selectedEvent?: EventModel;

  constructor(tableGroupsService: TableGroupsService, eventsService: EventsService) {
    super(tableGroupsService);

    this.selectedEvent = eventsService.getSelected();
    this.unsubscribe(eventsService.getSelected$.subscribe((it) => (this.selectedEvent = it)));
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.eventId = this.selectedEvent!.id;
    return model;
  }
}
