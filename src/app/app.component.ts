import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';

import {EnvironmentHelper} from './_shared/EnvironmentHelper';
import {ToastsContainerComponent} from './notifications/toasts-container.component';

@Component({
  template: `
    <ngx-loading-bar [includeSpinner]="false" color="#7599AA"></ngx-loading-bar>

    <router-outlet></router-outlet>

    <app-toasts aria-live="polite" aria-atomic="true"></app-toasts>
  `,
  standalone: true,
  selector: 'app-root',
  imports: [ToastsContainerComponent, LoadingBarRouterModule],
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    });

    if (EnvironmentHelper.getProduction()) {
      console.log(`
           .--.       .--.
 _  \`    \\     /    \`  _
  \`\\.===. \\.^./ .===./\`
         \\/\`"\`\\/
      ,  |     |  ,
     / \`\\|;-.-'|/\` \\
    /    |::\\  |    \\
 .-' ,-'\`|:::; |\`'-, '-.
     |   |::::\\|   |
     |   |::::;|   |
     |   \\:::://   |
     |    \`.://'   |
    .'             \`.
 _,'                 \`,_

 Hello nice fellow, debugging "compiled" Angular apps is not fun!\n
 Visit https://gitlab.com/DatePoll/WaiterRobot/WaiterRobot-Web for the source code.
      `);
    }
  }
}
