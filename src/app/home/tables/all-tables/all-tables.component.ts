import {Component} from '@angular/core';

import {Converter} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {TablesService} from '../../../_services/tables.service';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';

import {TableModel} from '../../../_models/table.model';
import {EventModel} from '../../../_models/event.model';

@Component({
  selector: 'app-all-tables',
  templateUrl: './all-tables.component.html',
  styleUrls: ['./all-tables.component.scss'],
})
export class AllTablesComponent extends AbstractModelsListComponent<TableModel> {
  selectedEvent: EventModel | undefined;

  constructor(protected modelService: TablesService, modal: NgbModal) {
    super(modelService, modal);

    this.modelService.setEventGetAllUrl();
  }

  protected override initializeVariables() {
    this.modelService.setEventGetAllUrl();
    super.initializeVariables();
  }

  protected checkFilterForModel(filter: string, model: TableModel): TableModel | undefined {
    if (Converter.numberToString(model.number) === filter || Converter.numberToString(model.seats) === filter) {
      return model;
    }
    return undefined;
  }
}
