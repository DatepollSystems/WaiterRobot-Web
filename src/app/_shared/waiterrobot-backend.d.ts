/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface MoveUnpaidOrdersBetweenTablesDto {
  /**
   * @format int64
   * @min 1
   */
  originalTableId: number;
  /**
   * @format int64
   * @min 1
   */
  newTableId: number;
}

export interface UpdatePasswordDto {
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  newPassword: string;
  oldPassword: string;
}

export interface UpdateEmailDto {
  /**
   * @minLength 6
   * @maxLength 255
   */
  emailAddress: string;
}

export interface UpdateSystemNotificationDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 1
   * @maxLength 100
   */
  title?: string;
  /**
   * @minLength 1
   * @maxLength 2000
   */
  description: string;
  active: boolean;
  type: 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS' | 'NEUTRAL';
  /** @format date-time */
  starts?: string;
  /** @format date-time */
  ends?: string;
}

export interface GetSystemNotificationResponse {
  /** @format int64 */
  id: number;
  title?: string;
  description: string;
  active: boolean;
  type: 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS' | 'NEUTRAL';
  /** @format date-time */
  starts?: string;
  /** @format date-time */
  ends?: string;
}

export interface UpdateWaiterDto {
  /** @format int64 */
  id: number;
  activated: boolean;
  /**
   * @minLength 3
   * @maxLength 70
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  eventIds: number[];
  updateToken?: boolean;
}

export interface IdResponse {
  /** @format int64 */
  id: number;
}

export interface MergeWaiterDto {
  /** @format int64 */
  waiterId: number;
  waiterIds: number[];
}

export interface UpdateUserDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 2
   * @maxLength 35
   */
  firstname: string;
  /**
   * @minLength 2
   * @maxLength 35
   */
  surname: string;
  /**
   * @minLength 6
   * @maxLength 255
   */
  emailAddress: string;
  role: 'ADMIN' | 'USER';
  activated: boolean;
  forcePasswordChange: boolean;
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  password?: string;
}

export interface UpdateTableDto {
  /** @format int64 */
  id: number;
  /**
   * @format int32
   * @min 0
   */
  number: number;
  /**
   * @format int32
   * @min 0
   */
  seats: number;
  /** @format int64 */
  groupId: number;
}

export interface UpdateTableGroupDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 1
   * @maxLength 60
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  /** @pattern #([0-9A-Fa-f]{6})$ */
  color?: string;
}

export interface UpdateProductDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 1
   * @maxLength 70
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  allergenIds: number[];
  /**
   * @format int32
   * @min 0
   */
  price: number;
  /** @format int64 */
  groupId: number;
  /** @format int64 */
  printerId: number;
  soldOut: boolean;
  /**
   * @format int32
   * @min 1
   */
  initialStock?: number;
  resetOrderedProducts: boolean;
}

export interface UpdateProductGroupDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 1
   * @maxLength 60
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  /** @pattern #([0-9A-Fa-f]{6})$ */
  color?: string;
  /** @format int64 */
  printerId?: number;
}

export interface UpdatePrinterDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 1
   * @maxLength 120
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  /**
   * @format int32
   * @min 5
   * @max 25
   */
  fontScale?: number;
  /**
   * @minLength 1
   * @maxLength 2
   */
  font?: string;
  /**
   * @format int32
   * @min 60
   * @max 160
   */
  bonWidth?: number;
  /**
   * @format int32
   * @min 0
   * @max 10
   */
  bonPadding?: number;
  /**
   * @format int32
   * @min 0
   * @max 10
   */
  bonPaddingTop?: number;
}

export interface UpdateOrganisationDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 4
   * @maxLength 40
   */
  name: string;
  /**
   * @minLength 4
   * @maxLength 80
   */
  street: string;
  /**
   * @minLength 1
   * @maxLength 20
   */
  streetNumber: string;
  /**
   * @minLength 2
   * @maxLength 16
   */
  postalCode: string;
  /**
   * @minLength 4
   * @maxLength 60
   */
  city: string;
  /**
   * @minLength 2
   * @maxLength 4
   */
  countryCode: string;
}

export interface OrganisationUserDto {
  role: 'ADMIN' | 'MEMBER';
}

export interface OrganisationSettingStringSetDto {
  value: string;
}

export interface OrganisationSettingBooleanSetDto {
  value: boolean;
}

export interface UpdateEventOrLocationDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 4
   * @maxLength 40
   */
  name: string;
  /**
   * @minLength 4
   * @maxLength 80
   */
  street: string;
  /**
   * @minLength 1
   * @maxLength 20
   */
  streetNumber: string;
  /**
   * @minLength 2
   * @maxLength 16
   */
  postalCode: string;
  /**
   * @minLength 4
   * @maxLength 60
   */
  city: string;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  updateWaiterCreateToken?: boolean;
}

export interface UpdateAllergenDto {
  /**
   * @format int64
   * @min 0
   */
  id: number;
  name: string;
  /**
   * @minLength 1
   * @maxLength 3
   */
  shortName: string;
  global?: boolean;
}

export interface CreateOrderDto {
  /**
   * @format int64
   * @min 1
   */
  tableId: number;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  products: CreateOrderProductDto[];
}

export interface CreateOrderProductDto {
  /**
   * @format int64
   * @min 1
   */
  id: number;
  /**
   * @minLength 0
   * @maxLength 120
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  note?: string;
  /**
   * @format int32
   * @min 1
   */
  amount: number;
}

export interface WaiterFcmTokenDto {
  /**
   * @minLength 60
   * @maxLength 180
   */
  fcmToken: string;
}

export interface PayBillDto {
  products: PayBillProductDto[];
}

export interface PayBillProductDto {
  /** @format int64 */
  id: number;
  /** @format int32 */
  amount: number;
}

export interface BillProductResponse {
  /** @format int64 */
  id: number;
  name: string;
  /** @format int32 */
  pricePerPiece: number;
  /** @format int32 */
  amount: number;
}

export interface PayBillResponse {
  /** @format int64 */
  billId: number;
  /** @format int64 */
  tableId: number;
  /** @format int32 */
  priceSum: number;
  products: BillProductResponse[];
}

export interface RefreshJwtWithSessionTokenDto {
  refreshToken: string;
  /**
   * @minLength 6
   * @maxLength 60
   */
  sessionInformation: string;
}

export interface JwtResponse {
  accessToken?: string;
  refreshToken?: string;
}

export interface LogoutDto {
  refreshToken: string;
}

export interface WaiterLoginDto {
  token: string;
  /**
   * @minLength 6
   * @maxLength 60
   */
  sessionInformation?: string;
  stayLoggedIn: boolean;
}

export interface WaiterLoginCreateDto {
  waiterCreateToken: string;
  /**
   * @minLength 3
   * @maxLength 70
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  /**
   * @minLength 6
   * @maxLength 60
   */
  sessionInformation: string;
}

export interface CreateSystemNotificationDto {
  /**
   * @minLength 1
   * @maxLength 100
   */
  title?: string;
  /**
   * @minLength 1
   * @maxLength 2000
   */
  description: string;
  active: boolean;
  type: 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS' | 'NEUTRAL';
  /** @format date-time */
  starts?: string;
  /** @format date-time */
  ends?: string;
}

export interface CreateWaiterDto {
  /**
   * @minLength 3
   * @maxLength 70
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  activated: boolean;
  eventIds: number[];
  /** @format int64 */
  organisationId: number;
}

export interface CreateUserDto {
  /**
   * @minLength 2
   * @maxLength 35
   */
  firstname: string;
  /**
   * @minLength 2
   * @maxLength 35
   */
  surname: string;
  /**
   * @minLength 6
   * @maxLength 255
   */
  emailAddress: string;
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  password: string;
  activated: boolean;
  sendInvitation: boolean;
  role: 'ADMIN' | 'USER';
}

export interface CreateTableDto {
  /**
   * @format int32
   * @min 0
   */
  number: number;
  /**
   * @format int32
   * @min 0
   */
  seats: number;
  /** @format int64 */
  groupId: number;
}

export interface CreateTableGroupDto {
  /**
   * @minLength 1
   * @maxLength 60
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  /** @pattern #([0-9A-Fa-f]{6})$ */
  color?: string;
  /** @format int64 */
  eventId: number;
}

export interface CreateProductDto {
  /**
   * @minLength 1
   * @maxLength 70
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  allergenIds: number[];
  /**
   * @format int32
   * @min 0
   */
  price: number;
  /** @format int64 */
  groupId: number;
  /** @format int64 */
  printerId: number;
  soldOut: boolean;
  /**
   * @format int32
   * @min 1
   */
  initialStock?: number;
}

export interface CreateProductGroupDto {
  /**
   * @minLength 1
   * @maxLength 60
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  /** @pattern #([0-9A-Fa-f]{6})$ */
  color?: string;
  /** @format int64 */
  eventId: number;
}

export interface CreatePrinterDto {
  /**
   * @minLength 1
   * @maxLength 120
   * @pattern ^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  /**
   * @format int32
   * @min 5
   * @max 25
   */
  fontScale?: number;
  /**
   * @minLength 1
   * @maxLength 2
   */
  font?: string;
  /**
   * @format int32
   * @min 60
   * @max 160
   */
  bonWidth?: number;
  /**
   * @format int32
   * @min 0
   * @max 10
   */
  bonPadding?: number;
  /**
   * @format int32
   * @min 0
   * @max 10
   */
  bonPaddingTop?: number;
  /**
   * @format int64
   * @min 0
   */
  eventId: number;
}

export interface CreateOrganisationDto {
  /**
   * @minLength 4
   * @maxLength 40
   */
  name: string;
  /**
   * @minLength 4
   * @maxLength 80
   */
  street: string;
  /**
   * @minLength 1
   * @maxLength 20
   */
  streetNumber: string;
  /**
   * @minLength 2
   * @maxLength 16
   */
  postalCode: string;
  /**
   * @minLength 4
   * @maxLength 60
   */
  city: string;
  /**
   * @minLength 2
   * @maxLength 4
   */
  countryCode: string;
}

export interface CreateEventOrLocationDto {
  /**
   * @minLength 4
   * @maxLength 40
   */
  name: string;
  /**
   * @minLength 4
   * @maxLength 80
   */
  street: string;
  /**
   * @minLength 1
   * @maxLength 20
   */
  streetNumber: string;
  /**
   * @minLength 2
   * @maxLength 16
   */
  postalCode: string;
  /**
   * @minLength 4
   * @maxLength 60
   */
  city: string;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  /** @format int64 */
  organisationId: number;
}

export interface CreateAllergenDto {
  name: string;
  /**
   * @minLength 1
   * @maxLength 3
   */
  shortName: string;
  global?: boolean;
}

export interface SignInWithPasswordChangeDto {
  email: string;
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  newPassword: string;
  oldPassword: string;
  /**
   * @minLength 6
   * @maxLength 60
   */
  sessionInformation?: string;
  stayLoggedIn?: boolean;
  password?: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
  /**
   * @minLength 6
   * @maxLength 60
   */
  sessionInformation?: string;
  stayLoggedIn?: boolean;
}

export interface EntityOrderDto {
  /**
   * @format int64
   * @min 0
   */
  entityId: number;
  /**
   * @format int32
   * @min 0
   */
  order: number;
}

export interface GetTableGroupMinResponse {
  /** @format int64 */
  id: number;
  name: string;
  color?: string;
}

export interface GetTableResponse {
  /** @format int64 */
  id: number;
  publicId: string;
  /** @format int32 */
  number: number;
  /** @format int32 */
  seats: number;
  /** @format int32 */
  position?: number;
  /**
   * Please use the 'group' property
   * @deprecated
   * @format int64
   */
  groupId: number;
  /**
   * Please use the 'group' property
   * @deprecated
   */
  groupName: string;
  group: GetTableGroupMinResponse;
  /** @format int64 */
  eventId: number;
  hasActiveOrders: boolean;
  /** @format date-time */
  deleted?: string;
}

export interface SessionResponse {
  /** @format int64 */
  id: number;
  description: string;
  /** @format int64 */
  entityId: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface JsonInfoResponse {
  info: string;
  version: string;
  /** @format date-time */
  serverTime: string;
  /** @format date-time */
  serverStartTime: string;
}

export interface GetAllergenResponse {
  /** @format int64 */
  id: number;
  name: string;
  shortName: string;
}

export interface GetProductGroupMaxResponse {
  /** @format int64 */
  id: number;
  name: string;
  products: GetProductResponse[];
  /** @format date-time */
  deleted?: string;
  /** @format int32 */
  position?: number;
  color?: string;
}

export interface GetProductResponse {
  /** @format int64 */
  id: number;
  name: string;
  /** @format int32 */
  price: number;
  soldOut: boolean;
  /** @format int32 */
  position?: number;
  allergens: GetAllergenResponse[];
  /** @format date-time */
  deleted?: string;
}

export interface GetWaiterMyselfResponse {
  /** @format int64 */
  id: number;
  name: string;
  /** @format int64 */
  organisationId: number;
  organisationName: string;
  eventIds: number[];
}

export interface GetEventOrLocationResponse {
  /** @format int64 */
  id: number;
  name: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  waiterCreateToken: string;
  /** @format int64 */
  organisationId: number;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  /**
   * Please use 'startDate' or 'endDate' property
   * @deprecated
   */
  date?: string;
  /** @format date-time */
  deleted?: string;
}

export interface GetBillForTableResponse {
  /** @format int64 */
  tableId: number;
  /** @format int32 */
  tableNumber: number;
  products: BillProductResponse[];
}

export interface GetBillResponse {
  /** @format int64 */
  id: number;
  table: GetTableMinResponse;
  waiter: GetWaiterMinResponse;
  /** @format date-time */
  createdAt: string;
  products: BillProductResponse[];
}

export interface GetTableMinResponse {
  /** @format int64 */
  id: number;
  publicId: string;
  /** @format int32 */
  number: number;
  group: GetTableGroupMinResponse;
}

export interface GetWaiterMinResponse {
  /** @format int64 */
  id: number;
  name: string;
}

export interface GetMyselfResponse {
  /** @format int64 */
  id: number;
  emailAddress: string;
  firstname: string;
  surname: string;
  role: 'ADMIN' | 'USER';
}

export interface GetEventOrLocationMinResponse {
  /** @format int64 */
  id: number;
  name: string;
}

export interface GetWaiterResponse {
  /** @format int64 */
  id: number;
  name: string;
  signInToken: string;
  activated: boolean;
  /** @format int64 */
  organisationId: number;
  events: GetEventOrLocationMinResponse[];
  /** @format date-time */
  deleted?: string;
}

export interface GetWaiterFcmTokenResponse {
  /** @format int64 */
  id: number;
  fcmToken: string;
}

export interface DuplicateWaiterResponse {
  name: string;
  waiters: IdAndNameResponse[];
}

export interface IdAndNameResponse {
  /** @format int64 */
  id: number;
  name: string;
}

export interface GetUserResponse {
  /** @format int64 */
  id: number;
  firstname: string;
  surname: string;
  emailAddress: string;
  activated: boolean;
  forcePasswordChange: boolean;
  role: 'ADMIN' | 'USER';
}

export interface GetTableGroupResponse {
  /** @format int64 */
  id: number;
  name: string;
  /** @format int64 */
  eventId: number;
  /** @format date-time */
  deleted?: string;
  /** @format int32 */
  position?: number;
  color?: string;
}

export interface StatisticsTimelineDataEntryResponse {
  /** @format date-time */
  name: string;
  /** @format int64 */
  value: number;
}

export interface StatisticsTimelineDataResponse {
  name: string;
  /** @format int64 */
  id: number;
  series: StatisticsTimelineDataEntryResponse[];
}

export interface StatisticsTimelineResponse {
  /** @format int64 */
  highestValue: number;
  data: StatisticsTimelineDataResponse[];
}

export interface StatisticsSumResponse {
  name: string;
  /** @format int64 */
  value: number;
}

export interface StatisticsCountResponse {
  /** @format int64 */
  orderedProducts: number;
  /** @format int64 */
  orders: number;
  /** @format int64 */
  turnover: number;
  bestWaiter?: StatisticsSumResponse;
  bestProduct?: StatisticsSumResponse;
}

export interface GetPrinterMinResponse {
  /** @format int64 */
  id: number;
  name: string;
}

export interface GetProductGroupMinResponse {
  /** @format int64 */
  id: number;
  name: string;
  color?: string;
}

export interface GetProductMaxResponse {
  /** @format int64 */
  id: number;
  name: string;
  /** @format int32 */
  price: number;
  soldOut: boolean;
  /** @format int32 */
  initialStock?: number;
  /** @format int32 */
  amountOrdered: number;
  /** @format int32 */
  position?: number;
  group: GetProductGroupMinResponse;
  printer: GetPrinterMinResponse;
  allergens: GetAllergenResponse[];
  /** @format date-time */
  deleted?: string;
}

export interface GetProductGroupResponse {
  /** @format int64 */
  id: number;
  name: string;
  /** @format int64 */
  eventId: number;
  /** @format int32 */
  position?: number;
  /** @format date-time */
  deleted?: string;
  color?: string;
}

export interface GetPrinterFontResponse {
  code: string;
  description: string;
}

export interface GetPrinterResponse {
  /** @format int64 */
  id: number;
  name: string;
  /** @format int32 */
  fontScale: number;
  font: GetPrinterFontResponse;
  /** @format int32 */
  bonWidth: number;
  /** @format int32 */
  bonPadding: number;
  /** @format int32 */
  bonPaddingTop: number;
  /** @format int64 */
  eventId: number;
  products: GetProductMinResponse[];
  /** @format date-time */
  deleted?: string;
}

export interface GetProductMinResponse {
  /** @format int64 */
  id: number;
  name: string;
}

export interface GetOrganisationResponse {
  /** @format int64 */
  id: number;
  name: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  countryCode: string;
  /** @format date-time */
  deleted?: string;
}

export interface OrganisationUserResponse {
  emailAddress: string;
  firstname: string;
  surname: string;
  role: 'ADMIN' | 'MEMBER';
  /** @format int64 */
  organisationId: number;
}

export interface Pageable {
  /**
   * @format int32
   * @min 0
   */
  page?: number;
  /**
   * @format int32
   * @min 1
   */
  size?: number;
  sort?: string[];
}

export interface PaginatedResponseGetOrganisationResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetOrganisationResponse[];
}

export interface OrganisationSettingResponse {
  activateWaiterOnLoginViaCreateToken: boolean;
  /** @uniqueItems true */
  availableTimezones: string[];
  timezone: string;
}

export interface GetOrderMinResponse {
  /** @format int64 */
  id: number;
  table: GetTableMinResponse;
  waiter: GetWaiterMinResponse;
  orderNumber: string;
  state: 'QUEUED' | 'IN_PROGRESS' | 'FINISHED';
  /** @format date-time */
  processedAt?: string;
  /** @format date-time */
  createdAt: string;
  orderProductStates: ('PRINTED' | 'SENT_TO_PRINT' | 'QUEUED')[];
}

export interface PaginatedResponseGetOrderMinResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetOrderMinResponse[];
}

export interface GetOrderProductResponse {
  /** @format int64 */
  id: number;
  product: GetProductMinResponse;
  note?: string;
  /** @format int32 */
  amount: number;
  printState: 'PRINTED' | 'SENT_TO_PRINT' | 'QUEUED';
  /** @format date-time */
  printedAt?: string;
  /** @format date-time */
  sentToPrinterAt?: string;
  printedBy: GetPrinterMinResponse;
}

export interface GetOrderResponse {
  /** @format int64 */
  id: number;
  table: GetTableMinResponse;
  waiter: GetWaiterMinResponse;
  orderNumber: string;
  state: 'QUEUED' | 'IN_PROGRESS' | 'FINISHED';
  /** @format date-time */
  processedAt?: string;
  /** @format date-time */
  createdAt: string;
  orderProducts: GetOrderProductResponse[];
}

export interface GetMediatorResponse {
  id: string;
  name?: string;
  /** @format int64 */
  organisationId: number;
  active: boolean;
  printers: GetPrinterMinResponse[];
  /** @format date-time */
  lastContact: string;
}

export interface GetBillMinResponse {
  /** @format int64 */
  id: number;
  table: GetTableMinResponse;
  waiter: GetWaiterMinResponse;
  /** @format int32 */
  priceSum: number;
  /** @format date-time */
  createdAt: string;
}

export interface PaginatedResponseGetBillMinResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetBillMinResponse[];
}
