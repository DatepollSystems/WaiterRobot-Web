import {Component} from '@angular/core';
import {loggerOf, n_from, n_isNumeric} from 'dfts-helper';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';

import {NotificationService} from '../../../notifications/notification.service';

import {EventModel} from '../../events/_models/event.model';

import {EventsService} from '../../events/_services/events.service';
import {TableGroupModel} from '../_models/table-group.model';
import {TableModel} from '../_models/table.model';
import {TableGroupsService} from '../_services/table-groups.service';
import {TablesService} from '../_services/tables.service';

@Component({
  selector: 'app-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrls: ['./table-edit.component.scss'],
})
export class TableEditComponent extends AbstractModelEditComponent<TableModel> {
  private log = loggerOf('TableEditComponent');
  override redirectUrl = '/home/tables/all';
  override continuousUsePropertyNames = ['groupId', 'seats'];

  selectedEvent?: EventModel;

  tableGroups: TableGroupModel[];
  selectedTableGroup?: number;

  constructor(
    tablesService: TablesService,
    eventsService: EventsService,
    tableGroupsService: TableGroupsService,
    private notificationService: NotificationService
  ) {
    super(tablesService);

    this.selectedEvent = eventsService.getSelected();
    this.tableGroups = tableGroupsService.getAll();
    this.unsubscribe(
      eventsService.getSelected$.subscribe((event) => {
        this.selectedEvent = event;
      }),
      tableGroupsService.allChange.subscribe((tableGroups) => {
        this.tableGroups = tableGroups;
      }),
      this.route.queryParams.subscribe((params) => {
        const id = params.group;
        if (n_isNumeric(id)) {
          this.selectedTableGroup = n_from(id);
          this.log.info('constructor', 'Selected table group: ' + id);
        }
      })
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.eventId = this.selectedEvent!.id;
    return model;
  }

  override createAndUpdateFilter(model: any): boolean {
    if (!this.selectedTableGroup) {
      this.notificationService.twarning('HOME_TABLES_GROUPS_DEFAULT');
      return false;
    }
    return super.createAndUpdateFilter(model);
  }

  override onEntityEdit(model: TableModel): void {
    this.selectedTableGroup = model.groupId;
  }

  selectTableGroup(value: number): void {
    this.log.info('selectTableGroup', 'Selecting Table group', value);
  }
}
