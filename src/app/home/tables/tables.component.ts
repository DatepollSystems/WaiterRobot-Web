import {Component} from '@angular/core';

import {AbstractModelsComponent} from '../../_shared/ui/abstract-models.component';
import {TableGroupModel} from './_models/table-group.model';
import {TableGroupsService} from './_services/table-groups.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent extends AbstractModelsComponent<TableGroupModel> {
  constructor(tableGroupsService: TableGroupsService) {
    super(tableGroupsService);
  }
}
