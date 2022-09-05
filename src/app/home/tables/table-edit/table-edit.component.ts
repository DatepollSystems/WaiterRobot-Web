import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Converter, LoggerFactory, TypeHelper} from 'dfx-helper';
import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';

import {EventModel} from '../../../_models/event.model';
import {TableGroupModel} from '../../../_models/table/table-group.model';
import {TableModel} from '../../../_models/table/table.model';

import {EventsService} from '../../../_services/models/events.service';
import {TableGroupsService} from '../../../_services/models/table/table-groups.service';
import {TablesService} from '../../../_services/models/table/tables.service';

import {NotificationService} from '../../../_services/notifications/notification.service';

@Component({
  selector: 'app-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrls: ['./table-edit.component.scss'],
})
export class TableEditComponent extends AbstractModelEditComponent<TableModel> {
  private log = LoggerFactory.getLogger('TableEditComponent');
  override redirectUrl = '/home/tables/all';
  override continuousUsePropertyNames = ['groupId', 'seats'];

  selectedEvent?: EventModel;

  tableGroups: TableGroupModel[];
  selectedTableGroup?: number;

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

    route.queryParams.subscribe((params) => {
      const id = params.group;
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          this.selectedTableGroup = Converter.toNumber(id);
          this.log.info('constructor', 'Selected table group: ' + id);
        }
      }
    });
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
