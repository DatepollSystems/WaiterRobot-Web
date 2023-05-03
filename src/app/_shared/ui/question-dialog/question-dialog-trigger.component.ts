import {Component, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {answerType, QuestionDialogComponent} from './question-dialog.component';

@Component({
  selector: 'app-question-modal-trigger',
  template: `
    <div (click)="openModal()">
      <ng-content />
    </div>
  `,
})
export class QuestionDialogTriggerComponent {
  @Input() question?: string;

  @Input() answers?: answerType[];

  @Input() title?: string;

  @Input() onClose?: (answer: answerType) => void;

  constructor(private modal: NgbModal) {}

  openModal(): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.question = this.question;
    if (this.answers) {
      modalRef.componentInstance.answers = this.answers;
    }
    void modalRef.result.then((result) => {
      if (this.onClose) {
        this.onClose(result as answerType);
      }
    });
  }
}
