import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {TablesService} from '../../../_services/models/tables.service';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';

import {TableModel} from '../../../_models/table.model';
import {EventModel} from '../../../_models/event.model';

@Component({
  selector: 'app-all-tables',
  templateUrl: './all-tables.component.html',
  styleUrls: ['./all-tables.component.scss'],
})
export class AllTablesComponent extends AbstractModelsListComponent<TableModel> {
  override columnsToDisplay = ['number', 'seats', 'actions'];

  selectedEvent: EventModel | undefined;

  constructor(protected entitiesService: TablesService, modal: NgbModal) {
    super(modal, entitiesService);

    this.entitiesService.setSelectedEventGetAllUrl();
  }

  protected override initializeEntities(): void {
    this.entitiesService.setSelectedEventGetAllUrl();
    super.initializeEntities();
  }
}
