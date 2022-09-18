import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {Component, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {QuestionDialogComponent} from './question-dialog.component';

@Component({
  selector: 'app-confirm-modal',
  template: `
    <div (click)="!_disabled ? openModal() : null" [class.disabled]="_disabled">
      <ng-content></ng-content>
    </div>
  `,
})
export class ConfirmDialogComponent {
  @Input() question?: string;
  @Input() title?: string;
  _disabled = false;

  @Input() set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Input() onConfirm!: () => void;
  @Input() onClose?: () => void;

  constructor(private modal: NgbModal) {}

  openModal(): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.question = this.question;
    void modalRef.result.then((result) => {
      if ((result as string).includes(QuestionDialogComponent.YES_VALUE)) {
        this.onConfirm();
      }
      if (this.onClose) {
        this.onClose();
      }
    });
  }
}
