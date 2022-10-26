import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';
import {SessionModel} from '../_models/session.model';
import {UserSessionsService} from '../_services/user-sessions.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent extends AbstractModelsListComponent<SessionModel> {
  override columnsToDisplay = ['name', 'registeredAt', 'updatedAt', 'actions'];

  constructor(sessionsService: UserSessionsService, modal: NgbModal) {
    super(modal, sessionsService);

    this.setSelectable();
  }
}
