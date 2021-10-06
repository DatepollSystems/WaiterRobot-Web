import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {TablesService} from '../../../_services/tables.service';
import {TableGroupsService} from '../../../_services/table-groups.service';
import {AbstractModelsListComponentById} from '../../../_helper/abstract-models-list-by-id.component';

import {TableModel} from '../../../_models/table.model';
import {TableGroupModel} from '../../../_models/table-group.model';

@Component({
  selector: 'app-table-group-by-id-tables',
  templateUrl: './table-group-by-id-tables.component.html',
  styleUrls: ['./table-group-by-id-tables.component.scss'],
})
export class TableGroupByIdTablesComponent extends AbstractModelsListComponentById<TableModel, TableGroupModel> {
  //TODO: Change to group_id
  override getAllUrl = '/config/table?group_id=';

  constructor(
    tablesService: TablesService,
    tableGroupsService: TableGroupsService,
    route: ActivatedRoute,
    router: Router,
    modal: NgbModal
  ) {
    super(tablesService, modal, route, router, tableGroupsService);
  }

  protected override checkFilterForModel(filter: string, model: TableModel): TableModel | undefined {
    if (model.name.trim().toLowerCase().includes(filter)) {
      return model;
    }
    return undefined;
  }
}