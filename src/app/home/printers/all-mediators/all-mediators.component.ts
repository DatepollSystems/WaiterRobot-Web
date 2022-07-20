import {Component} from '@angular/core';

import {StringHelper} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {MediatorsService} from '../../../_services/models/mediators.service';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';

import {MediatorModel} from '../../../_models/mediator.model';
import {GetPrinterMinResponse} from '../../../_models/waiterrobot-backend';

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

  onMap(printers: GetPrinterMinResponse[]): string {
    return StringHelper.getImploded(
      printers.map((printer) => printer.name),
      20
    );
  }
}
