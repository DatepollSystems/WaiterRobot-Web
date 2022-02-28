import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {TableGroupsService} from '../../../_services/models/table/table-groups.service';
import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {TableGroupModel} from '../../../_models/table/table-group.model';

@Component({
  selector: 'app-table-groups',
  templateUrl: './table-groups.component.html',
  styleUrls: ['./table-groups.component.scss'],
})
export class TableGroupsComponent extends AbstractModelsListComponent<TableGroupModel> {
  override columnsToDisplay = ['name', 'seats', 'actions'];

  constructor(tableGroupsService: TableGroupsService, modal: NgbModal) {
    super(modal, tableGroupsService);
  }
}
