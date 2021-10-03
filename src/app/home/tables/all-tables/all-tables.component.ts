import {Component} from '@angular/core';

import {Converter} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {UsersService} from '../../../_services/users.service';
import {UserModel} from '../../../_models/user.model';
import {TableModel} from '../../../_models/table.model';
import {TablesService} from '../../../_services/tables.service';

@Component({
  selector: 'app-all-tables',
  templateUrl: './all-tables.component.html',
  styleUrls: ['./all-tables.component.scss'],
})
export class AllTablesComponent extends AbstractModelsListComponent<TableModel> {
  constructor(tableService: TablesService, modal: NgbModal) {
    super(tableService, modal);
  }

  protected checkFilterForModel(filter: string, model: TableModel): TableModel | undefined {
    if (Converter.numberToString(model.number) === filter || Converter.numberToString(model.seats) === filter) {
      return model;
    }
    return undefined;
  }
}
