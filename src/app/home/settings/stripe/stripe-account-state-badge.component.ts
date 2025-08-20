import {Component, inject, input, signal} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';

import {APIType} from '@shared/api';

import {StripeService} from '../_services/stripe.service';

@Component({
  template: `
    <button
      class="btn btn-sm d-inline-flex gap-2 align-items-center justify-content-between"
      [class.btnSpinner]="loading()"
      [disabled]="loading()"
      [class.btn-primary]="state() === 'ACTIVE'"
      [class.btn-warning]="state() === 'ONBOARDING'"
      (click)="$event.stopPropagation(); openLink()"
      type="button"
    >
      @switch (state()) {
        @case ('ONBOARDING') {
          Onboarding fortsetzen
        }
        @case ('ACTIVE') {
          Stripe-Dashboard öffnen
        }
      }
      <bi name="box-arrow-up-right" />
    </button>
  `,
  selector: 'app-stripe-account-state-badge',
  imports: [BiComponent],
})
export class StripeAccountStateBadge {
  stripeAccountId = input.required<string>();
  state = input.required<APIType['GetStripeAccountResponse']['state']>();

  loading = signal(false);

  organisationStripeService = inject(StripeService);

  openLink() {
    this.loading.set(true);
    this.organisationStripeService.openLink$(this.stripeAccountId()).subscribe({
      next: (it) => {
        if (it.state === 'ACTIVE') {
          this.loading.set(false);
          return;
        }
      },
      error: () => {
        void this.organisationStripeService.state.load(undefined);
      },
    });
  }
}
