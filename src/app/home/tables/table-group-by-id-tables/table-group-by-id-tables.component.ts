import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {TablesService} from '../../../_services/models/tables.service';
import {TableGroupsService} from '../../../_services/models/table-groups.service';
import {AbstractModelsListByIdComponent} from '../../../_helper/abstract-models-list-by-id.component';

import {TableModel} from '../../../_models/table.model';
import {TableGroupModel} from '../../../_models/table-group.model';

@Component({
  selector: 'app-table-group-by-id-tables',
  templateUrl: './table-group-by-id-tables.component.html',
  styleUrls: ['./table-group-by-id-tables.component.scss'],
})
export class TableGroupByIdTablesComponent extends AbstractModelsListByIdComponent<TableModel, TableGroupModel> {
  override columnsToDisplay = ['name', 'seats', 'actions'];
  override getAllParam = 'group_id';

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
