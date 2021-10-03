import {Component} from '@angular/core';

import {Converter} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {TableGroupsService} from '../../../_services/table-groups.service';
import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {TableGroupModel} from '../../../_models/table-group.model';

@Component({
  selector: 'app-table-groups',
  templateUrl: './table-groups.component.html',
  styleUrls: ['./table-groups.component.scss'],
})
export class TableGroupsComponent extends AbstractModelsListComponent<TableGroupModel> {
  constructor(tableGroupsService: TableGroupsService, modal: NgbModal) {
    super(tableGroupsService, modal);
  }

  protected checkFilterForModel(filter: string, model: TableGroupModel): TableGroupModel | undefined {
    if (model.name.trim().toLowerCase() === filter || Converter.numberToString(model.seats) === filter) {
      return model;
    }
    return undefined;
  }
}
