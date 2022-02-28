import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {SessionsService} from '../../../_services/models/user/sessions.service';
import {SessionModel} from '../../../_models/user/session.model';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent extends AbstractModelsListComponent<SessionModel> {
  override columnsToDisplay = ['name', 'registered_at', 'updated_at', 'actions'];

  constructor(sessionsService: SessionsService, modal: NgbModal) {
    super(modal, sessionsService);
  }
}
