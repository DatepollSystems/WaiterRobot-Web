import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {SessionsService} from '../../../_services/sessions.service';
import {SessionsModel} from '../../../_models/session.model';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent extends AbstractModelsListComponent<SessionsModel> {
  override columnsToDisplay = ['name', 'registered_at', 'actions'];

  constructor(sessionsService: SessionsService, modal: NgbModal) {
    super(sessionsService, modal);
  }
}
