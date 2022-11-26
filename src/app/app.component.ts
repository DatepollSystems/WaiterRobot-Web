import {Component} from '@angular/core';
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
export class AppComponent {
  constructor() {
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
