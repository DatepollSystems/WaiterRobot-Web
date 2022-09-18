import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {EventModel} from '../../../_models/event.model';

import {TableModel} from '../../../_models/table/table.model';

import {TablesService} from '../../../_services/models/table/tables.service';

@Component({
  selector: 'app-all-tables',
  templateUrl: './all-tables.component.html',
  styleUrls: ['./all-tables.component.scss'],
})
export class AllTablesComponent extends AbstractModelsListComponent<TableModel> {
  override columnsToDisplay = ['groupName', 'number', 'seats', 'actions'];

  selectedEvent: EventModel | undefined;

  constructor(protected entitiesService: TablesService, modal: NgbModal) {
    super(modal, entitiesService);

    this.setSelectable();

    this.entitiesService.setSelectedEventGetAllUrl();
  }

  protected override initializeEntities(): void {
    this.entitiesService.setSelectedEventGetAllUrl();
    super.initializeEntities();
  }
}
