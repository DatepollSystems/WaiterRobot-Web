import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractModelsListComponent} from '../../../../_shared/ui/abstract-models-list.component';

import {SessionModel} from '../../../user-settings/_models/session.model';
import {WaiterSessionsService} from '../../_services/waiter-sessions.service';

import {QuestionDialogComponent} from '../../../../_shared/ui/question-dialog/question-dialog.component';

@Component({
  selector: 'app-waiter-sessions',
  templateUrl: './waiter-sessions.component.html',
  styles: [],
})
export class WaiterSessionsComponent extends AbstractModelsListComponent<SessionModel> {
  override columnsToDisplay = ['name', 'registeredAt', 'updatedAt', 'actions'];

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
          this.entitiesService.delete(session.id).subscribe();
        }
      }
    });
  }
}
