import {Component} from '@angular/core';
import {RouterOutlet, Routes} from '@angular/router';
import {AppLogoWithTextComponent} from '../_shared/ui/app-logo-with-text.component';
import {FooterModule} from '../_shared/ui/footer/footer.module';

@Component({
  template: `
    <div class="d-container text-white">
      <app-logo-with-text></app-logo-with-text>
      <div style="padding: 15px 10px">
        <div class="card bg-dark mx-auto col-11 col-md-6 col-lg-4">
          <div class="card-body">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styleUrls: ['../about/about.component.scss'],
  selector: 'app-mobile-link',
  standalone: true,
  imports: [AppLogoWithTextComponent, FooterModule, RouterOutlet],
})
export class MobileLinkComponent {}

export const ROUTES: Routes = [
  {
    path: '',
    component: MobileLinkComponent,
    children: [
      {
        path: 't/:id',
        loadComponent: () => import('./mobile-link-table.component').then((m) => m.MobileLinkTableComponent),
      },
      {
        path: '**',
        loadComponent: () => import('./mobile-link-home.component').then((m) => m.MobileLinkHomeComponent),
      },
    ],
  },
];
