import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./info.component').then((c) => c.InfoComponent),
    children: [
      {path: 'imprint', title: 'ABOUT_IMPRINT', loadComponent: () => import('./imprint.component').then((c) => c.ImprintComponent)},
      {
        path: 'privacypolicy',
        title: 'ABOUT_PRIVACY_POLICY',
        loadComponent: () => import('./privacy-policy.component').then((c) => c.PrivacyPolicyComponent),
      },
      {
        path: 'mobile-privacypolicy',
        title: 'ABOUT_PRIVACY_POLICY',
        loadComponent: () => import('./mobile-privacy-policy.component').then((c) => c.MobilePrivacyPolicyComponent),
      },
    ],
  },
];
