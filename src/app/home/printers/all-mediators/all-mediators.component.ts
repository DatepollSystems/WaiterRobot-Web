import {Component} from '@angular/core';

import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';

import {MediatorModel} from '../_models/mediator.model';

import {MediatorsService} from '../_services/mediators.service';

@Component({
  selector: 'app-all-mediators',
  templateUrl: './all-mediators.component.html',
  styleUrls: ['./all-mediators.component.scss'],
})
export class AllMediatorsComponent extends AbstractModelsListComponent<MediatorModel> {
  override columnsToDisplay = ['id', 'name', 'active', 'lastContact', 'printers'];

  constructor(mediatorsService: MediatorsService) {
    super(mediatorsService);
  }
}
