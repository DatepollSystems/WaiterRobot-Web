import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {QuestionDialogComponent} from '../../../../_shared/question-dialog/question-dialog.component';
import {WaiterSessionsService} from '../../../../_services/models/waiter/waiter-sessions.service';
import {AbstractModelsListComponent} from '../../../../_helper/abstract-models-list.component';

import {SessionModel} from '../../../../_models/user/session.model';

@Component({
  selector: 'app-waiter-sessions',
  templateUrl: './waiter-sessions.component.html',
  styles: [],
})
export class WaiterSessionsComponent extends AbstractModelsListComponent<SessionModel> {
  override columnsToDisplay = ['name', 'registered_at', 'updated_at', 'actions'];

  constructor(sessionsService: WaiterSessionsService, modal: NgbModal) {
    super(modal, sessionsService);
  }

  deleteAll(): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      this.lumber.info('onDelete', 'Question dialog result:', result);
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        for (const session of this.entities) {
          this.entitiesService.delete(session.id);
        }
      }
    });
  }
}
