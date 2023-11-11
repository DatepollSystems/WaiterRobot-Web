import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {loggerOf} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {BiComponent, BiName} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div class="modal-header border-bottom-0">
      <h1 class="modal-title fs-5">{{ (title ? title : question) | tr }}</h1>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    @if (question || info) { @if (info) {
    <div [innerHTML]="info"></div>
    } @else {
    <strong>{{ question | tr }}</strong>
    }
    <div class="modal-body py-0">
      <p>
        This is a modal sheet, a variation of the modal that docs itself to the bottom of the viewport like the newer share sheets in iOS.
      </p>
    </div>
    }
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
      @for (answer of answers; track answer.value) {
      <button (click)="answerQuestion(answer.value)" class="btn btn-outline-secondary" type="button">
        @if (answer.icon) {
        <bi [name]="answer.icon" />
        }
        {{ answer.text | tr }}
      </button>
      }
    </div>
  `,
  selector: 'app-question-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr, BiComponent],
  standalone: true,
})
export class QuestionDialogComponent {
  public static YES_VALUE = 'yes';
  public static NO_VALUE = 'no';
  public static YES_NO_ANSWERS: answerType[] = [
    {
      icon: 'check-circle-fill',
      text: 'YES',
      value: QuestionDialogComponent.YES_VALUE,
    },
    {
      icon: 'x-circle-fill',
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
  icon?: BiName;
  text: string;
  value: string;
};

export function injectConfirmDialog(): (title: string, info?: string) => Promise<boolean> {
  const modal = inject(NgbModal);

  return (title: string, info?: string): Promise<boolean> => {
    const modalRef = modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'md'});
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
