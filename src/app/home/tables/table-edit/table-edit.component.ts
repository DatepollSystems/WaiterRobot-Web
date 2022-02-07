import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {EventsService} from '../../../_services/models/events.service';
import {TablesService} from '../../../_services/models/tables.service';
import {EventModel} from '../../../_models/event.model';
import {TableModel} from '../../../_models/table.model';
import {TableGroupModel} from '../../../_models/table-group.model';
import {TableGroupsService} from '../../../_services/models/table-groups.service';
import {Converter, LoggerFactory} from 'dfx-helper';
import {NotificationService} from '../../../_services/notifications/notification.service';

@Component({
  selector: 'app-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrls: ['./table-edit.component.scss'],
})
export class TableEditComponent extends AbstractModelEditComponent<TableModel> {
  override redirectUrl = '/home/tables/all';

  private log = LoggerFactory.getLogger('TableEditComponent');

  selectedEvent: EventModel | undefined;
  tableGroups: TableGroupModel[];
  selectedTableGroup = 'default';

  constructor(
    route: ActivatedRoute,
    router: Router,
    tablesService: TablesService,
    modal: NgbModal,
    private eventsService: EventsService,
    private tableGroupsService: TableGroupsService,
    private notificationService: NotificationService
  ) {
    super(router, route, modal, tablesService);

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(
      this.eventsService.selectedChange.subscribe((event) => {
        this.selectedEvent = event;
      })
    );

    this.tableGroups = this.tableGroupsService.getAll();
    this.autoUnsubscribe(
      this.tableGroupsService.allChange.subscribe((tableGroups) => {
        this.tableGroups = tableGroups;
      })
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.event_id = this.selectedEvent?.id;
    model.group_id = Converter.toString(this.selectedTableGroup);
    return model;
  }

  override createAndUpdateFilter(model: any): boolean {
    if (this.selectedTableGroup.includes('default')) {
      this.notificationService.twarning('HOME_TABLES_GROUPS_DEFAULT');
      return false;
    }
    return super.createAndUpdateFilter(model);
  }

  override onModelEdit(model: TableModel): void {
    this.selectedTableGroup = Converter.toString(model.group_id);
  }

  selectTableGroup(value: string): void {
    if (value.includes('default')) {
      return;
    }
    this.log.info('selectTableGroup', 'Selecting Table group', value);
  }
}
