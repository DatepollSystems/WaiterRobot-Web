import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AbstractModelsComponent} from '../../_helper/abstract-models.component';
import {TableGroupsService} from '../../_services/models/table-groups.service';
import {TableGroupModel} from '../../_models/table-group.model';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent extends AbstractModelsComponent<TableGroupModel> {
  constructor(router: Router, tableGroupsService: TableGroupsService) {
    super(router, tableGroupsService);
  }
}
