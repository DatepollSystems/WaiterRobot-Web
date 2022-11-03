import {NgModule} from '@angular/core';
import {
  apple,
  arrowClockwise,
  bagFill,
  barChartLineFill,
  boxArrowLeft,
  building,
  calendarDate,
  calendarEventFill,
  caretRight,
  check2Square,
  clipboard,
  columnsGap,
  diagram3,
  fileLock,
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
  starFill,
  table,
  trash,
  union,
  upcScan,
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
  router,
  printer,
  table,
  pencilFill,
  arrowClockwise,
  listUl,
  graphUp,
  pieChartFill,
  barChartLineFill,
  starFill,
};

@NgModule({
  imports: [NgxBootstrapIconsModule.pick(icons)],
  exports: [NgxBootstrapIconsModule],
})
export class AppIconsModule {}
