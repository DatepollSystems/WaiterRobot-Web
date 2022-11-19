import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';

import {MediatorModel} from '../_models/mediator.model';
import {GetPrinterMinResponse} from '../../../_shared/waiterrobot-backend';

import {MediatorsService} from '../_services/mediators.service';

@Component({
  selector: 'app-all-mediators',
  templateUrl: './all-mediators.component.html',
  styleUrls: ['./all-mediators.component.scss'],
})
export class AllMediatorsComponent extends AbstractModelsListComponent<MediatorModel> {
  override columnsToDisplay = ['id', 'name', 'active', 'lastContact', 'printers'];

  constructor(modal: NgbModal, mediatorsService: MediatorsService) {
    super(modal, mediatorsService);
  }

  onMap = (it: GetPrinterMinResponse): string => it.name;
}
