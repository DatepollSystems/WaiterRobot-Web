import {AsyncPipe, LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {allowedCharacterSet} from '@home-shared/regex';
import {CreateStripeAccountDto} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title-org-stripe-create">
        {{ 'STRIPE_ACCOUNT' | tr }} {{ (action === 'CREATE' ? 'ADD_3' : 'EDIT') | tr | lowercase }}
      </h3>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    @if (form.valueChanges | async) {}
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="modal-body">
        <div class="form-group col">
          <label for="stripeName">{{ 'NAME' | tr }}</label>
          <input
            formControlName="name"
            class="form-control"
            type="text"
            id="stripeName"
            placeholder="Stripe Account #{{ existingStripeAccountCount + 1 }}"
          />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'Name incorrect' | tr }}
            </small>
          }
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-success" type="submit" [disabled]="form.invalid">
          {{ (action === 'CREATE' ? 'ADD_3' : 'SAVE') | tr }}
        </button>
        <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
      </div>
    </form>
  `,
  selector: 'app-organisation-stripe-add-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr, LowerCasePipe, BiComponent, NgSelectModule, ReactiveFormsModule, AsyncPipe],
})
export class OrganisationStripeAccountModal {
  action!: 'CREATE' | 'UPDATE';
  organisationId!: number;
  existingStripeAccountCount!: number;

  activeModal = inject(NgbActiveModal);

  form = inject(FormBuilder).nonNullable.group({
    name: [undefined as unknown as string, [Validators.minLength(4), Validators.maxLength(40), Validators.pattern(allowedCharacterSet)]],
    businessType: ['NON_PROFIT' as CreateStripeAccountDto['businessType'], [Validators.required]],
    eventId: [undefined as unknown as number],
  });

  submit(): void {
    const name =
      this.form.controls.name.value && this.form.controls.name.value !== ''
        ? this.form.controls.name.value
        : `Stripe Account #${this.existingStripeAccountCount + 1}`;
    this.activeModal.close({
      ...this.form.getRawValue(),
      name,
      organisationId: this.organisationId,
    });
  }
}
