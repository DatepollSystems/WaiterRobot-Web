import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {loggerOf} from 'dfts-helper';
import {BiComponent, BiName} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div class="modal-header border-bottom-0">
      <h1 class="modal-title fs-5">{{ (title ? title : question) | transloco }}</h1>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body py-0">
      @if (question || info) {
        @if (info) {
          <div [innerHTML]="info"></div>
        } @else {
          <strong>{{ question | transloco }}</strong>
        }
      }
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | transloco }}</button>
      @for (answer of answers; track answer.value) {
        <button class="btn btn-outline-secondary" type="button" (click)="answerQuestion(answer.value)">
          @if (answer.icon) {
            <bi [name]="answer.icon" />
          }
          {{ answer.text | transloco }}
        </button>
      }
    </div>
  `,
  selector: 'app-question-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, BiComponent],
  standalone: true,
})
export class QuestionDialogComponent {
  activeModal = inject(NgbActiveModal);

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

  answerQuestion(value: string): void {
    this.lumber.info('answerQuestion', 'Question dialog result:', value);
    this.activeModal.close(value);
  }
}

export interface answerType {
  icon?: BiName;
  text: string;
  value: string;
}

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
        .catch(() => {
          resolve(false);
        });
    });
  };
}
