import {NgModule} from '@angular/core';
import {
  bagFill,
  boxArrowLeft,
  building,
  calendarEventFill,
  caretRight,
  check2Square,
  clipboard,
  columnsGap,
  diagram3,
  fileLock,
  gear,
  gearWideConnected,
  NgxBootstrapIconsModule,
  pencilSquare,
  people,
  peopleFill,
  personBadge,
  plusCircle,
  save,
  trash,
  upcScan,
  xCircleFill,
} from 'ngx-bootstrap-icons';

// Select some icons (use an object, not an array)
const icons = {
  people,
  peopleFill,
  calendarEventFill,
  building,
  gearWideConnected,
  fileLock,
  boxArrowLeft,
  gear,
  plusCircle,
  check2Square,
  clipboard,
  save,
  trash,
  pencilSquare,
  xCircleFill,
  bagFill,
  caretRight,
  personBadge,
  upcScan,
  columnsGap,
  diagram3,
};

@NgModule({
  imports: [NgxBootstrapIconsModule.pick(icons)],
  exports: [NgxBootstrapIconsModule],
})
export class IconsModule {}
