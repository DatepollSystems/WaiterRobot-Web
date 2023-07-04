import {NgModule} from '@angular/core';
import {
  apple,
  arrowClockwise,
  arrowLeft,
  arrowsFullscreen,
  bagFill,
  barChartLineFill,
  boxArrowLeft,
  boxArrowUpRight,
  building,
  calendarDate,
  calendarEventFill,
  caretRight,
  cashStack,
  check2Square,
  clipboard,
  columnsGap,
  diagram3,
  fileLock,
  fullscreenExit,
  gear,
  gearWideConnected,
  google,
  graphUp,
  listUl,
  NgxBootstrapIconsModule,
  pencilFill,
  pencilSquare,
  people,
  peopleFill,
  personBadge,
  personBoundingBox,
  personXFill,
  pieChartFill,
  plusCircle,
  printer,
  qrCode,
  qrCodeScan,
  router,
  save,
  stack,
  starFill,
  table,
  trash,
  union,
  upcScan,
  viewStacked,
  wifiOff,
  xCircleFill,
} from 'ngx-bootstrap-icons';

const icons = {
  people,
  peopleFill,
  calendarEventFill,
  calendarDate,
  building,
  gearWideConnected,
  fileLock,
  boxArrowLeft,
  boxArrowUpRight,
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
  personXFill,
  upcScan,
  columnsGap,
  diagram3,
  google,
  apple,
  qrCode,
  qrCodeScan,
  personBoundingBox,
  union,
  cashStack,
  viewStacked,
  router,
  stack,
  printer,
  arrowsFullscreen,
  fullscreenExit,
  table,
  pencilFill,
  arrowClockwise,
  listUl,
  graphUp,
  pieChartFill,
  barChartLineFill,
  starFill,
  arrowLeft,
  wifiOff,
};

@NgModule({
  imports: [NgxBootstrapIconsModule.pick(icons)],
  exports: [NgxBootstrapIconsModule],
})
export class AppIconsModule {}
