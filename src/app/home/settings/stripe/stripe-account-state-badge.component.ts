import {Component, inject, input, signal} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';

import {GetStripeAccountResponse} from '@shared/waiterrobot-backend';
import {BiComponent} from 'dfx-bootstrap-icons';

import {OrganisationsStripeService} from '../../_admin/organisations/_services/organisations-stripe.service';

@Component({
  template: `
    <button
      type="button"
      class="btn btn-sm d-inline-flex gap-2 align-items-center justify-content-between"
      [class.btnSpinner]="loading()"
      [disabled]="loading()"
      [class.btn-primary]="state() === 'ACTIVE'"
      [class.btn-warning]="state() === 'ONBOARDING'"
      (click)="$event.stopPropagation(); openLink()"
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
  imports: [TranslocoPipe, BiComponent],
  standalone: true,
})
export class StripeAccountStateBadge {
  stripeAccountId = input.required<string>();
  state = input.required<GetStripeAccountResponse['state']>();

  loading = signal(false);

  organisationStripeService = inject(OrganisationsStripeService);

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
