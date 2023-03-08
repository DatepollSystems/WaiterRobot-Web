/* tslint:disable */
/* eslint-disable */

// Generated using typescript-generator version 3.0.1157 on 2022-10-19 17:10:06.

export interface ErrorResponse {
  message: string;
  code: number;
  codeName: string;
}

export interface IdAndNameResponse {
  id: number;
  name: string;
}

export interface IdResponse {
  id: number;
}

export interface PaginatedResponseDto<T> {
  numberOfItems: number;
  numberOfPages: number;
  list: T[];
}

export interface JsonInfoResponse {
  info: string;
  version: string;
  serverTime: DateAsString;
  serverStartTime: DateAsString;
}

export interface AllergenDto {
  id: number;
  name: string;
  shortName: string;
}

export interface CreateAllergenDto {
  name: string;
  shortName: string;
  global?: boolean;
}

export interface GetAllergenResponse {
  id: number;
  name: string;
  shortName: string;
}

export interface UpdateAllergenDto {
  id: number;
  name: string;
  shortName: string;
  global?: boolean;
}

export interface ISignInDto {
  authIdentifier: string;
  sessionInformation: string;
  stayLoggedIn: boolean;
}

export interface ISignInWithPasswordChangeDto extends ISignInWithPasswordDto {
  newPassword: string;
  oldPassword: string;
}

export interface ISignInWithPasswordDto extends ISignInDto {
  password: string;
}

export interface JWTResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutDto {
  sessionToken: string;
}

export interface RefreshJWTWithSessionTokenDto {
  refreshToken: string;
  sessionInformation: string;
}

export interface SessionResponse {
  id: number;
  description: string;
  entityId: number;
  createdAt: DateAsString;
  updatedAt: DateAsString;
}

export interface SignInWithPasswordChangeDto extends ISignInWithPasswordChangeDto {
  email: string;
}

export interface UserSignInDto extends ISignInWithPasswordDto {
  email: string;
}

export interface WaiterSignInCreateDto {
  waiterCreateToken: string;
  name: string;
  sessionInformation: string;
}

export interface WaiterSignInDto extends ISignInDto {
  token: string;
}

export interface BillProductResponse {
  id: number;
  name: string;
  pricePerPiece: number;
  price: number;
  amount: number;
}

export interface GetBillForTableResponse {
  tableId: number;
  tableNumber: number;
  priceSum: number;
  products: BillProductResponse[];
}

export interface PayBillDto {
  products: PayBillProductDto[];
}

export interface PayBillProductDto {
  id: number;
  amount: number;
}

export interface PayBillResponse {
  billId: number;
  tableId: number;
  tableNumber: number;
  priceSum: number;
  products: BillProductResponse[];
}

export interface CreateEventOrLocationDto {
  name: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  date?: DateAsString;
  organisationId: number;
}

export interface GetEventOrLocationMinResponse {
  id: number;
  name: string;
}

export interface GetEventOrLocationResponse {
  id: number;
  name: string;
  date?: DateAsString;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  waiterCreateToken: string;
  organisationId: number;
}

export interface UpdateEventOrLocationDto {
  id: number;
  name: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  date?: DateAsString;
  updateWaiterCreateToken?: boolean;
}

export interface FcmMessageDto {
  fcmToken: string;
  data: {[index: string]: string};
}

export interface GetMediatorResponse {
  id: string;
  name?: string;
  organisationId: number;
  active: boolean;
  lastContact?: DateAsString;
  printers: GetPrinterMinResponse[];
}

export interface CreateOrderDto {
  tableId: number;
  products: CreateOrderProductDto[];
}

export interface CreateOrderProductDto {
  id: number;
  note?: string;
  amount: number;
}

export interface GetOrderResponse {
  id: number;
  orderId: number;
  table: GetTableMinResponse;
  product: GetProductMinResponse;
  waiter: GetWaiterMinResponse;
  note?: string;
  amount: number;
  printState: PrintState;
}

export interface OrderDto {
  tableNumber: number;
  waiterId: number;
  orderId: number;
  orderProducts: OrderProductDto[];
}

export interface OrderProductDto extends Mergeable<OrderProductDto> {
  id: number;
  name: string;
  note?: string;
  amount: number;
  printerId: number;
}

export interface ProductWithNameDto {
  id: number;
  name: string;
  amount: number;
}

export interface CreateOrganisationDto {
  name: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  countryCode: string;
}

export interface GetOrganisationResponse {
  id: number;
  name: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  countryCode: string;
}

export interface OrganisationSettingBooleanSetDto {
  value: boolean;
}

export interface OrganisationSettingResponse {
  activateWaiterOnSignInViaCreateToken: boolean;
}

export interface OrganisationUserDto {
  role: UserOrganisationRole;
}

export interface OrganisationUserResponse {
  emailAddress: string;
  firstname: string;
  surname: string;
  role: UserOrganisationRole;
  organisationId: number;
}

export interface UpdateOrganisationDto {
  id: number;
  name: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  countryCode: string;
}

export interface PrintOrderDto {
  tableNumber: number;
  waiter: GetWaiterMinResponse;
  products: OrderProductDto[];
}

export interface CreatePrinterDto {
  name: string;
  printerName: string;
  eventId: number;
}

export interface GetPrinterMinResponse {
  id: number;
  name: string;
}

export interface GetPrinterResponse {
  id: number;
  name: string;
  printerName: string;
  eventId: number;
  products: GetProductMinResponse[];
}

export interface UpdatePrinterDto {
  id: number;
  name: string;
  printerName: string;
  eventId: number;
}

export interface CreateProductDto {
  name: string;
  allergenIds: number[];
  price: number;
  groupId: number;
  printerId: number;
  soldOut: boolean;
}

export interface CreateProductGroupDto {
  name: string;
  eventId: number;
}

export interface GetProductGroupMaxResponse {
  id: number;
  name: string;
  products: GetProductResponse[];
}

export interface GetProductGroupMinResponse {
  id: number;
  name: string;
}

export interface GetProductGroupResponse {
  id: number;
  name: string;
  eventId: number;
}

export interface GetProductMaxResponse {
  id: number;
  name: string;
  price: number;
  soldOut: boolean;
  group: GetProductGroupMinResponse;
  printer: GetPrinterMinResponse;
  allergens: GetAllergenResponse[];
}

export interface GetProductMinResponse {
  id: number;
  name: string;
}

export interface GetProductResponse {
  id: number;
  name: string;
  price: number;
  soldOut: boolean;
  allergens: GetAllergenResponse[];
}

export interface UpdateProductDto {
  id: number;
  name: string;
  allergenIds: number[];
  price: number;
  groupId: number;
  printerId: number;
  soldOut: boolean;
}

export interface UpdateProductGroupDto {
  id: number;
  name: string;
  printerId?: number;
}

export interface StatisticsCountResponse {
  orderedProducts?: number;
  orders?: number;
  turnover?: number;
  bestWaiter?: StatisticsSumResponse;
  bestProduct?: StatisticsSumResponse;
}

export interface StatisticsSumResponse {
  name: string;
  value: number;
}

export interface StatisticsSumResponse {
  name: string;
  value: number;
}

export interface StatisticsTimelineResponse {
  name: string;
  id: number;
  series: {name: string; value: number}[];
}

export interface StatisticsTimelineResponse {
  highestValue: number;
  data: StatisticsTimelineDataResponse[];
}

export interface StatisticsTimelineDataResponse {
  name: string;
  id: number;
  series: StatisticsTimelineDataEntryResponse;
}

export interface StatisticsTimelineDataEntryResponse {
  name: DateAsString;
  value: number;
}

export interface CreateTableDto {
  number: number;
  seats: number;
  groupId: number;
}

export interface CreateTableGroupDto {
  name: string;
  eventId: number;
}

export interface GetTableGroupResponse {
  id: number;
  name: string;
  eventId: number;
}

export interface GetTableMinResponse {
  id: number;
  number: number;
}

export interface GetTableResponse {
  id: number;
  number: number;
  seats: number;
  groupId: number;
  groupName: string;
  eventId: number;
}

export interface UpdateTableDto {
  id: number;
  number: number;
  seats: number;
  groupId: number;
}

export interface UpdateTableGroupDto {
  id: number;
  name: string;
}

export interface CreateUserDto {
  firstname: string;
  surname: string;
  birthday: DateAsString;
  emailAddress: string;
  password: string;
  activated: boolean;
  role: UserGlobalRole;
}

export interface GetMyselfResponse {
  id: number;
  emailAddress: string;
  firstname: string;
  surname: string;
  birthday: DateAsString;
  role: UserGlobalRole;
}

export interface GetUserResponse {
  id: number;
  firstname: string;
  surname: string;
  emailAddress: string;
  activated: boolean;
  forcePasswordChange: boolean;
  birthday: DateAsString;
  role: UserGlobalRole;
}

export interface UpdateEmailDto {
  emailAddress: string;
}

export interface UpdatePasswordDto {
  newPassword: string;
  oldPassword: string;
}

export interface UpdateUserDto {
  id: number;
  firstname: string;
  surname: string;
  birthday: DateAsString;
  emailAddress: string;
  role: UserGlobalRole;
  activated: boolean;
  forcePasswordChange: boolean;
  password?: string;
}

export interface CreateWaiterDto {
  name: string;
  activated: boolean;
  eventIds: number[];
  organisationId: number;
}

export interface DuplicateWaiterResponse {
  name: string;
  waiters: IdAndNameResponse[];
}

export interface GetWaiterFcmTokenResponse {
  id: number;
  fcmToken: string;
}

export interface GetWaiterMinResponse {
  id: number;
  name: string;
}

export interface GetWaiterMyselfResponse {
  id: number;
  name: string;
  organisationId: number;
  organisationName: string;
  eventIds: number[];
}

export interface GetWaiterResponse {
  id: number;
  name: string;
  signInToken: string;
  activated: boolean;
  deleted: boolean;
  organisationId: number;
  events: GetEventOrLocationMinResponse[];
}

export interface MergeWaiterDto {
  waiterId: number;
  waiterIds: number[];
}

export interface UpdateWaiterDto {
  id: number;
  activated: boolean;
  name: string;
  eventIds: number[];
  updateToken?: boolean;
}

export interface WaiterFcmTokenDto {
  fcmToken: string;
}

export interface WebSocketDto<T> {
  messageObjectId: WebSocketMessageTypes;
  httpStatus: number;
  body: T;
}

export interface FileDto {
  mime: string;
  data: string;
}

export interface RegisterMediatorDto {
  mediatorId: number;
}

export interface Mergeable<T> {}

export type DateAsString = string;

export type PrintState = 'PRINTED' | 'SENT_TO_PRINT' | 'BLOCKED' | 'IN_QUEUE';

export type UserOrganisationRole = 'ADMIN' | 'MEMBER';

export type UserGlobalRole = 'ADMIN' | 'USER';

export type WebSocketMessageTypes =
  | 'BM_PRINT_PDF'
  | 'MB_REGISTER_PRINTER'
  | 'BM_REGISTERED_PRINTER_SUCCESSFUL'
  | 'MB_UNREGISTER_PRINTER'
  | 'BM_UNREGISTERED_PRINTER_SUCCESSFUL'
  | 'MB_PRINTED_PDF'
  | 'MB_PRINT_PDF_ERROR'
  | 'MB_HELLO'
  | 'BM_HELLO'
  | 'MB_PRINT_PDF_TEST'
  | 'BM_ERROR'
  | 'MB_ERROR'
  | 'MB_PING';
