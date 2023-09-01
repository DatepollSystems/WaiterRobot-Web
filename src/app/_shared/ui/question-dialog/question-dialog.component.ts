import {NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {loggerOf} from 'dfts-helper';
import {DfxTrackByProperty} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

@Component({
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
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
      <button
        *ngFor="let answer of answers; trackByProperty: 'value'"
        (click)="answerQuestion(answer.value)"
        type="button"
        class="btn btn-outline-secondary"
      >
        {{ answer.text | tr }}
      </button>
    </div>
  `,
  selector: 'app-question-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgForOf, DfxTr, DfxTrackByProperty],
  standalone: true,
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

  lumber = loggerOf('QuestionDialogComponent');

  constructor(public activeModal: NgbActiveModal) {}

  answerQuestion(value: string): void {
    this.lumber.info('answerQuestion', 'Question dialog result:', value);
    this.activeModal.close(value);
  }
}

export type answerType = {
  icon: string | null;
  text: string;
  value: string;
};

export function injectConfirmDialog(): (title: string, info?: string) => Promise<boolean> {
  const modal = inject(NgbModal);

  return (title: string, info?: string): Promise<boolean> => {
    const modalRef = modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = title;

    if (info) {
      modalRef.componentInstance.info = info;
    }

    return new Promise((resolve) => {
      modalRef.result
        .then((result) => {
          if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
            resolve(true);
          }
          resolve(false);
        })
        .catch(() => resolve(false));
    });
  };
}
