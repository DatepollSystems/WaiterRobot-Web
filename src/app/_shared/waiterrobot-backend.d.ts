/* eslint-disable */
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
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
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
  sendInvitation: boolean;
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
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  /** @pattern #([0-9A-Fa-f]{6})$ */
  color?: string;
}

export interface UpdateStripeAccountDto {
  id: string;
  /**
   * @minLength 4
   * @maxLength 40
   */
  name: string;
  eventIds: number[];
}

export interface AlphabeticIdResponse {
  id: string;
}

export interface UpdateProductDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 1
   * @maxLength 70
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
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
  /** @pattern #([0-9A-Fa-f]{6})$ */
  color?: string;
  resetOrderedProducts: boolean;
}

export interface UpdateProductGroupDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 1
   * @maxLength 60
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
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
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
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
   * @max 30
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

export interface OrganisationSettingsResponse {
  activateWaiterOnLoginViaCreateToken: boolean;
  timezone: string;
  stripeEnabled: boolean;
  /** @uniqueItems true */
  availableTimezones: string[];
  /** @format int32 */
  stripeMinAmount: number;
}

export interface OrganisationSettingIntSetDto {
  /** @format int32 */
  value: number;
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

export interface UpdateBillUnpaidReasonDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 1
   * @maxLength 120
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
   */
  reason: string;
  /**
   * @minLength 1
   * @maxLength 120
   */
  description: string;
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

export interface PayBillDto {
  /**
   * @format int64
   * @min 1
   */
  tableId: number;
  /** @format int64 */
  unpaidReasonId?: number;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  orderProducts: number[];
}

export interface GetBillResponse {
  /** @format int64 */
  id: number;
  table: GetTableWithGroupMinResponse;
  waiter: GetWaiterMinResponse;
  /** @format date-time */
  createdAt: string;
  /** @format int32 */
  pricePaidSum: number;
  unpaidReason?: GetBillUnpaidReasonResponse;
  implodedBillProducts: GetImplodedBillProductResponse[];
}

export interface GetBillUnpaidReasonResponse {
  /** @format int64 */
  id: number;
  reason: string;
  description?: string;
  isGlobal: boolean;
}

export interface GetImplodedBillProductResponse {
  name: string;
  /** @format int32 */
  pricePaidSum: number;
  /** @format int32 */
  pricePaidPerPiece: number;
  /** @format int64 */
  productId: number;
  /** @format int32 */
  amount: number;
  billProductIds: number[];
}

export interface GetImplodedOpenBillProductResponse {
  name: string;
  /** @format int32 */
  priceSum: number;
  /** @format int32 */
  pricePerPiece: number;
  /** @format int32 */
  amount: number;
  /** @format int64 */
  baseProductId: number;
  orderProductIds: number[];
}

export interface GetOpenBillResponse {
  implodedOrderProducts: GetImplodedOpenBillProductResponse[];
  /** @format int32 */
  priceSum: number;
}

export interface GetTableGroupMinResponse {
  /** @format int64 */
  id: number;
  name: string;
  color?: string;
  /** @format int32 */
  position?: number;
}

export interface GetTableWithGroupMinResponse {
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

export interface PayBillResponse {
  bill: GetBillResponse;
  openBill: GetOpenBillResponse;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
}

export interface CreateOrderDto {
  /**
   * @format int64
   * @min 1
   */
  tableId: number;
  /**
   * @maxItems 150
   * @minItems 1
   */
  products: CreateOrderProductDto[];
  /**
   * @minLength 0
   * @maxLength 36
   */
  clientOrderId?: string;
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
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
   */
  note?: string;
  /**
   * @format int32
   * @min 1
   * @max 400
   */
  amount: number;
}

export interface GetImplodedOrderProductResponse {
  product: GetProductMinResponse;
  note?: string;
  printState: 'PRINTED' | 'SENT_TO_PRINT' | 'QUEUED';
  /** @format date-time */
  printedAt?: string;
  /** @format date-time */
  sentToPrinterAt?: string;
  printedBy: GetPrinterMinResponse;
  /** @format int32 */
  amount: number;
  orderProductIds: number[];
}

export interface GetOrderResponse {
  /** @format int64 */
  id: number;
  table: GetTableWithGroupMinResponse;
  waiter: GetWaiterMinResponse;
  orderNumber: string;
  state: 'QUEUED' | 'IN_PROGRESS' | 'FINISHED';
  /** @format date-time */
  processedAt?: string;
  /** @format date-time */
  createdAt: string;
  orderProducts: GetImplodedOrderProductResponse[];
  test: boolean;
}

export interface GetPrinterMinResponse {
  /** @format int64 */
  id: number;
  name: string;
}

export interface GetProductMinResponse {
  /** @format int64 */
  id: number;
  name: string;
  color?: string;
}

export interface WaiterFcmTokenDto {
  /**
   * @minLength 60
   * @maxLength 180
   */
  fcmToken: string;
}

export interface PayBillDtoV1 {
  products: PayBillProductDtoV1[];
}

export interface PayBillProductDtoV1 {
  /** @format int64 */
  id: number;
  /** @format int32 */
  amount: number;
}

export interface BillProductResponseV1 {
  /** @format int64 */
  id: number;
  name: string;
  /** @format int32 */
  pricePerPiece: number;
  /** @format int32 */
  amount: number;
}

export interface PayBillResponseV1 {
  /** @format int64 */
  billId: number;
  /** @format int64 */
  tableId: number;
  /** @format int32 */
  priceSum: number;
  products: BillProductResponseV1[];
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
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
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

export interface ContactFormDto {
  email: string;
  /**
   * @minLength 5
   * @maxLength 100
   */
  phoneNumber: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 100
   */
  topic: string;
  /**
   * @minLength 2
   * @maxLength 400
   */
  message: string;
}

export interface CreateWaiterDto {
  /**
   * @minLength 3
   * @maxLength 70
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
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
  password?: string;
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
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
   */
  name: string;
  /** @pattern #([0-9A-Fa-f]{6})$ */
  color?: string;
  /** @format int64 */
  eventId: number;
}

export interface CreateStripeAccountDto {
  /**
   * @minLength 4
   * @maxLength 40
   */
  name: string;
  /** @format int64 */
  organisationId: number;
  eventIds: number[];
  businessType: 'COMPANY' | 'INDIVIDUAL' | 'NON_PROFIT';
}

export interface CreateProductDto {
  /**
   * @minLength 1
   * @maxLength 70
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
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
  /** @pattern #([0-9A-Fa-f]{6})$ */
  color?: string;
}

export interface CreateProductGroupDto {
  /**
   * @minLength 1
   * @maxLength 60
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
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
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
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
   * @max 30
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

export interface CreateBillUnpaidReasonDto {
  /**
   * @minLength 1
   * @maxLength 120
   * @pattern [a-zA-Z0-9\p{Z}\"'`´#~!?$€&%()={}\[\]_/*+-.,><\-|°\^\\:;ßäöüÄÖÜ\n\r]+$
   */
  reason: string;
  /**
   * @minLength 1
   * @maxLength 120
   */
  description: string;
  /** @format int64 */
  eventId?: number;
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

export interface PasswordForgotRequestDto {
  email: string;
}

export interface PasswordForgotResetDto {
  email: string;
  resetToken: string;
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  newPassword: string;
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
  password: string;
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
  order?: number;
}

export interface GetTableWithGroupResponse {
  /** @format int64 */
  id: number;
  publicId: string;
  /** @format int32 */
  number: number;
  /** @format int32 */
  seats: number;
  /**
   * Please use the 'group.id' property
   * @deprecated
   * @format int64
   */
  groupId: number;
  /**
   * Please use the 'group.name' property
   * @deprecated
   */
  groupName: string;
  group: GetTableGroupMinResponse;
  /** @format int64 */
  eventId: number;
  /** @format date-time */
  deleted?: string;
}

export interface GetTableGroupResponse {
  /** @format int64 */
  id: number;
  /** @format int64 */
  eventId: number;
  name: string;
  /** @format int32 */
  position?: number;
  color?: string;
  tables: GetTableMinResponse[];
  /** @format date-time */
  deleted?: string;
}

export interface GetTableMinResponse {
  /** @format int64 */
  id: number;
  publicId: string;
  /** @format int32 */
  number: number;
  /** @format date-time */
  deleted?: string;
}

export interface GetTableIdsWithActiveOrdersResponse {
  tableIds: number[];
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
  amountLeft?: number;
  /** @format int32 */
  position?: number;
  color?: string;
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
  stripeEnabled: boolean;
  /** @format int32 */
  stripeMinAmount?: number;
  stripeLocationId?: string;
  /**
   * Please use 'startDate' or 'endDate' property
   * @deprecated
   */
  date?: string;
  /** @format date-time */
  deleted?: string;
  isDemo: boolean;
}

export interface GetBillForTableResponseV1 {
  /** @format int64 */
  tableId: number;
  /** @format int32 */
  tableNumber: number;
  products: BillProductResponseV1[];
}

export interface GetMyselfResponse {
  /** @format int64 */
  id: number;
  emailAddress: string;
  firstname: string;
  surname: string;
  role: 'ADMIN' | 'USER';
}

export interface TempNotification {
  to: string;
  subject: string;
  body: string;
  bodyHTML?: string;
  id: string;
  /** @format date-time */
  createdAt: string;
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

export interface PaginatedResponseGetWaiterResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetWaiterResponse[];
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

export interface PaginatedResponseGetTableGroupResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetTableGroupResponse[];
}

export interface GetStripeAccountResponse {
  id: string;
  name: string;
  /** @format int64 */
  organisationId: number;
  events: GetEventOrLocationMinResponse[];
  state: 'ONBOARDING' | 'ACTIVE';
}

export interface GetStripeAccountLinkResponse {
  dashboardUrl?: string;
  onboardingUrl?: string;
}

export interface GetStripeAccountMaxResponse {
  id: string;
  name: string;
  /** @format int64 */
  organisationId: number;
  events: GetEventOrLocationMinResponse[];
  state: 'ONBOARDING' | 'ACTIVE';
  link: GetStripeAccountLinkResponse;
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

export interface GetProductGroupMinResponse {
  /** @format int64 */
  id: number;
  name: string;
  color?: string;
  /** @format int32 */
  position?: number;
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
  color?: string;
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

export interface PaginatedResponseGetProductGroupMaxResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetProductGroupMaxResponse[];
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
  bonPaddingTop?: number;
  /** @format int64 */
  eventId: number;
  products: GetProductMinResponse[];
  /** @format date-time */
  deleted?: string;
}

export interface PaginatedResponseGetPrinterResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetPrinterResponse[];
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

export interface PaginatedResponseGetOrganisationResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetOrganisationResponse[];
}

export interface GetOrderMinResponse {
  /** @format int64 */
  id: number;
  table: GetTableWithGroupMinResponse;
  waiter: GetWaiterMinResponse;
  orderNumber: string;
  state: 'QUEUED' | 'IN_PROGRESS' | 'FINISHED';
  /** @format date-time */
  processedAt?: string;
  /** @format date-time */
  createdAt: string;
  orderProductPrintStates: ('PRINTED' | 'SENT_TO_PRINT' | 'QUEUED')[];
  test: boolean;
}

export interface PaginatedResponseGetOrderMinResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetOrderMinResponse[];
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

export interface AdminInfoResponse {
  infos: Record<string, string>;
}

export interface DeadLetterResponse {
  /** @format int64 */
  id: number;
  body: string;
  queue: string;
  exchange: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface GetBillMinResponse {
  /** @format int64 */
  id: number;
  table: GetTableWithGroupMinResponse;
  waiter: GetWaiterMinResponse;
  /** @format date-time */
  createdAt: string;
  /** @format int32 */
  pricePaidSum: number;
  unpaidReason?: GetBillUnpaidReasonResponse;
}

export interface PaginatedResponseGetBillMinResponse {
  /** @format int64 */
  numberOfItems: number;
  /** @format int32 */
  numberOfPages: number;
  data: GetBillMinResponse[];
}
