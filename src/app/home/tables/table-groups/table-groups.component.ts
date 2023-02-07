import {Component} from '@angular/core';
import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';
import {TableGroupModel} from '../_models/table-group.model';

import {TableGroupsService} from '../_services/table-groups.service';

@Component({
  selector: 'app-table-groups',
  templateUrl: './table-groups.component.html',
  styleUrls: ['./table-groups.component.scss'],
})
export class TableGroupsComponent extends AbstractModelsListComponent<TableGroupModel> {
  override columnsToDisplay = ['name', 'seats', 'actions'];

  constructor(tableGroupsService: TableGroupsService) {
    super(tableGroupsService);

    this.setSelectable();
  }
}
