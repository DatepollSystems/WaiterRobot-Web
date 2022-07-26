import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractModelsListByIdComponent} from '../../../_helper/abstract-models-list-by-id.component';
import {TableGroupModel} from '../../../_models/table/table-group.model';

import {TableModel} from '../../../_models/table/table.model';
import {TableGroupsService} from '../../../_services/models/table/table-groups.service';

import {TablesService} from '../../../_services/models/table/tables.service';

@Component({
  selector: 'app-table-group-by-id-tables',
  templateUrl: './table-group-by-id-tables.component.html',
  styleUrls: ['./table-group-by-id-tables.component.scss'],
})
export class TableGroupByIdTablesComponent extends AbstractModelsListByIdComponent<TableModel, TableGroupModel> {
  override columnsToDisplay = ['name', 'seats', 'actions'];
  override getAllParam = 'groupId';

  constructor(
    tablesService: TablesService,
    tableGroupsService: TableGroupsService,
    route: ActivatedRoute,
    router: Router,
    modal: NgbModal
  ) {
    super(router, route, modal, tablesService, tableGroupsService);
  }
}
