import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-question-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-question-title">{{ (title ? title : question) | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body" *ngIf="question || info">
      <p *ngIf="question">
        <strong>{{ question | tr }}</strong>
      </p>
      <div *ngIf="info" [innerHTML]="info"></div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
      <button
        *ngFor="let answer of answers; trackByProperty: 'value'"
        (click)="answerQuestion(answer.value)"
        type="button"
        class="btn btn-outline-secondary">
        {{ answer.text | tr }}
      </button>
    </div>
  `,
})
export class QuestionDialogComponent {
  public static YES_VALUE = 'yes';
  public static NO_VALUE = 'no';
  public static YES_NO_ANSWERS: answerType[] = [
    {
      icon: 'done',
      text: 'YES',
      value: QuestionDialogComponent.YES_VALUE,
    },
    {
      icon: 'close',
      text: 'NO',
      value: QuestionDialogComponent.NO_VALUE,
    },
  ];

  @Input() question?: string;
  @Input() info?: string;

  @Input() answers: answerType[] = QuestionDialogComponent.YES_NO_ANSWERS;

  @Input() title?: string;

  constructor(public activeModal: NgbActiveModal) {}

  answerQuestion(value: string): void {
    this.activeModal.close(value);
  }
}

export type answerType = {
  icon: string | null;
  text: string;
  value: string;
};
