import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-question-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-question-title">{{ (title ? title : question) | tr }}</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body" *ngIf="question">
      <p>
        <strong>{{ question | tr }}</strong>
      </p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
      <button *ngFor="let answer of answers" (click)="answerQuestion(answer.value)" type="button" class="btn btn-outline-secondary">
        {{ answer.answer | tr }}
      </button>
    </div>
  `,
})
export class QuestionDialogComponent {
  public static YES_VALUE = 'yes';
  public static NO_VALUE = 'no';
  public static YES_NO_ANSWERS = [
    {
      icon: 'done',
      answer: 'YES',
      value: 'yes',
    },
    {
      icon: 'close',
      answer: 'NO',
      value: 'no',
    },
  ];

  @Input()
  title: string | undefined;

  @Input()
  answers: {
    icon: string | null;
    answer: string;
    value: string;
  }[] = QuestionDialogComponent.YES_NO_ANSWERS;

  @Input()
  question: string | undefined;

  constructor(public activeModal: NgbActiveModal) {}

  answerQuestion(value: string): void {
    this.activeModal.close(value);
  }
}
