import {NgModule} from '@angular/core';

import {
  apple,
  arrowClockwise,
  arrowLeft,
  arrowsFullscreen,
  arrowUpRightSquareFill,
  bagFill,
  barChartLineFill,
  bell,
  boxArrowLeft,
  boxArrowUpRight,
  building,
  calendarDate,
  calendarEventFill,
  caretRight,
  cashStack,
  check2Square,
  checkCircleFill,
  clipboard,
  columnsGap,
  diagram3,
  exclamationTriangleFill,
  fileLock,
  filetypeCsv,
  fullscreenExit,
  gear,
  gearWideConnected,
  google,
  graphUp,
  infoCircleFill,
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
  arrowUpRightSquareFill,
  fullscreenExit,
  table,
  pencilFill,
  exclamationTriangleFill,
  arrowClockwise,
  listUl,
  graphUp,
  pieChartFill,
  barChartLineFill,
  starFill,
  arrowLeft,
  wifiOff,
  bell,
  checkCircleFill,
  infoCircleFill,
  filetypeCsv,
};

@NgModule({
  imports: [NgxBootstrapIconsModule.pick(icons)],
  exports: [NgxBootstrapIconsModule],
})
export class AppIconsModule {}
