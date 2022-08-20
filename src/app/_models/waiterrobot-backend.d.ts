/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.36.1070 on 2022-08-20 13:53:03.

export interface ErrorResponse {
  readonly message: string;
  readonly code: number;
  readonly codeName: string;
}

export interface IdAndNameResponse {
  readonly id: number;
  readonly name: string;
}

export interface IdResponse {
  readonly id: number;
}

export interface PaginatedResponseDto<T> {
  readonly numberOfItems: number;
  readonly numberOfPages: number;
  readonly list: T[];
}

export interface JsonInfoResponse {
  readonly info: string;
  readonly version: string;
  readonly serverTime: DateAsString;
}

export interface AllergenDto {
  readonly id: number;
  readonly name: string;
  readonly shortName: string;
}

export interface CreateAllergenDto {
  readonly name: string;
  readonly shortName: string;
  readonly global?: boolean;
}

export interface GetAllergenResponse {
  readonly id: number;
  readonly name: string;
  readonly shortName: string;
}

export interface UpdateAllergenDto {
  readonly id: number;
  readonly name: string;
  readonly shortName: string;
  readonly global?: boolean;
}

export interface ISignInDto {
  readonly authIdentifier: string;
  readonly sessionInformation: string;
  readonly stayLoggedIn: boolean;
}

export interface ISignInWithPasswordChangeDto extends ISignInWithPasswordDto {
  readonly newPassword: string;
  readonly oldPassword: string;
}

export interface ISignInWithPasswordDto extends ISignInDto {
  readonly password: string;
}

export interface JWTResponse {
  readonly token?: string;
  readonly sessionToken?: string;
}

export interface LogoutDto {
  readonly sessionToken: string;
}

export interface RefreshJWTWithSessionTokenDto {
  readonly sessionToken: string;
  readonly sessionInformation: string;
}

export interface SessionResponse {
  readonly id: number;
  readonly description: string;
  readonly entityId: number;
  readonly createdAt: DateAsString;
  readonly updatedAt: DateAsString;
}

export interface SignInWithPasswordChangeDto extends ISignInWithPasswordChangeDto {
  readonly email: string;
}

export interface UserSignInDto extends ISignInWithPasswordDto {
  readonly email: string;
}

export interface WaiterSignInCreateDto {
  readonly waiterCreateToken: string;
  readonly name: string;
  readonly sessionInformation: string;
}

export interface WaiterSignInDto extends ISignInDto {
  readonly token: string;
}

export interface BillProductResponse {
  readonly id: number;
  readonly name: string;
  readonly pricePerPiece: number;
  readonly price: number;
  readonly amount: number;
}

export interface GetBillForTableResponse {
  readonly tableId: number;
  readonly tableNumber: number;
  readonly priceSum: number;
  readonly products: BillProductResponse[];
}

export interface PayBillDto {
  readonly products: PayBillProductDto[];
}

export interface PayBillProductDto {
  readonly id: number;
  readonly amount: number;
}

export interface PayBillResponse {
  readonly billId: number;
  readonly tableId: number;
  readonly tableNumber: number;
  readonly priceSum: number;
  readonly products: BillProductResponse[];
}

export interface CreateEventOrLocationDto {
  readonly name: string;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly date?: DateAsString;
  readonly organisationId: number;
}

export interface GetEventOrLocationResponse {
  readonly id: number;
  readonly name: string;
  readonly date?: DateAsString;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly waiterCreateToken: string;
  readonly organisationId: number;
}

export interface UpdateEventOrLocationDto {
  readonly id: number;
  readonly name: string;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly date?: DateAsString;
  readonly updateWaiterCreateToken?: boolean;
}

export interface GetMediatorResponse {
  readonly id: string;
  readonly name?: string;
  readonly organisationId: number;
  readonly active: boolean;
  readonly lastContact?: DateAsString;
  readonly printers: GetPrinterMinResponse[];
}

export interface CreateOrderDto {
  readonly tableId: number;
  readonly products: CreateOrderProductDto[];
}

export interface CreateOrderProductDto {
  readonly id: number;
  readonly amount: number;
}

export interface OrderDto {
  readonly tableNumber: number;
  readonly waiterId: number;
  readonly orderId: number;
  readonly orderProducts: OrderProductDto[];
}

export interface OrderProductDto extends Mergeable<OrderProductDto> {
  readonly id: number;
  readonly name: string;
  readonly note?: string;
  readonly amount: number;
  readonly printerId: number;
}

export interface ProductWithNameDto {
  readonly id: number;
  readonly name: string;
  readonly amount: number;
}

export interface CreateOrganisationDto {
  readonly name: string;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly countryCode: string;
}

export interface GetOrganisationResponse {
  readonly id: number;
  readonly name: string;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly countryCode: string;
}

export interface OrganisationSettingBooleanSetDto {
  readonly value: boolean;
}

export interface OrganisationSettingResponse {
  readonly activateWaiterOnSignInViaCreateToken: boolean;
}

export interface OrganisationUserDto {
  readonly role: UserOrganisationRole;
}

export interface OrganisationUserResponse {
  readonly emailAddress: string;
  readonly firstname: string;
  readonly surname: string;
  readonly role: UserOrganisationRole;
  readonly organisationId: number;
}

export interface UpdateOrganisationDto {
  readonly id: number;
  readonly name: string;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly countryCode: string;
}

export interface PrintOrderDto {
  readonly tableNumber: number;
  readonly waiter: GetWaiterMinResponse;
  readonly products: OrderProductDto[];
}

export interface CreatePrinterDto {
  readonly name: string;
  readonly printerName: string;
  readonly eventId: number;
}

export interface GetPrinterMinResponse {
  readonly id: number;
  readonly name: string;
}

export interface GetPrinterResponse {
  readonly id: number;
  readonly name: string;
  readonly printerName: string;
  readonly eventId: number;
  readonly products: GetProductMinResponse[];
}

export interface UpdatePrinterDto {
  readonly id: number;
  readonly name: string;
  readonly printerName: string;
  readonly eventId: number;
}

export interface CreateProductDto {
  readonly name: string;
  readonly allergenIds: number[];
  readonly price: number;
  readonly groupId: number;
  readonly printerId: number;
  readonly soldOut: boolean;
}

export interface CreateProductGroupDto {
  readonly name: string;
  readonly eventId: number;
}

export interface GetProductGroupMaxResponse {
  readonly id: number;
  readonly name: string;
  readonly products: GetProductResponse[];
}

export interface GetProductGroupMinResponse {
  readonly id: number;
  readonly name: string;
}

export interface GetProductGroupResponse {
  readonly id: number;
  readonly name: string;
  readonly eventId: number;
}

export interface GetProductMaxResponse {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly soldOut: boolean;
  readonly group: GetProductGroupMinResponse;
  readonly printer: GetPrinterMinResponse;
  readonly allergens: GetAllergenResponse[];
}

export interface GetProductMinResponse {
  readonly id: number;
  readonly name: string;
}

export interface GetProductResponse {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly soldOut: boolean;
  readonly allergens: GetAllergenResponse[];
}

export interface UpdateProductDto {
  readonly id: number;
  readonly name: string;
  readonly allergenIds: number[];
  readonly price: number;
  readonly groupId: number;
  readonly printerId: number;
  readonly soldOut: boolean;
}

export interface UpdateProductGroupDto {
  readonly id: number;
  readonly name: string;
  readonly printerId?: number;
}

export interface CreateTableDto {
  readonly number: number;
  readonly seats: number;
  readonly groupId: number;
}

export interface CreateTableGroupDto {
  readonly name: string;
  readonly eventId: number;
}

export interface GetTableGroupResponse {
  readonly id: number;
  readonly name: string;
  readonly eventId: number;
}

export interface GetTableResponse {
  readonly id: number;
  readonly number: number;
  readonly seats: number;
  readonly groupId: number;
  readonly groupName: string;
  readonly eventId: number;
}

export interface UpdateTableDto {
  readonly id: number;
  readonly number: number;
  readonly seats: number;
  readonly groupId: number;
}

export interface UpdateTableGroupDto {
  readonly id: number;
  readonly name: string;
}

export interface CreateUserDto {
  readonly firstname: string;
  readonly surname: string;
  readonly birthday: DateAsString;
  readonly emailAddress: string;
  readonly password: string;
  readonly activated: boolean;
  readonly role: UserGlobalRole;
}

export interface GetMyselfResponse {
  readonly id: number;
  readonly emailAddress: string;
  readonly firstname: string;
  readonly surname: string;
  readonly birthday: DateAsString;
  readonly role: UserGlobalRole;
}

export interface GetUserResponse {
  readonly id: number;
  readonly firstname: string;
  readonly surname: string;
  readonly emailAddress: string;
  readonly activated: boolean;
  readonly forcePasswordChange: boolean;
  readonly birthday: DateAsString;
  readonly role: UserGlobalRole;
}

export interface UpdateEmailDto {
  readonly emailAddress: string;
}

export interface UpdatePasswordDto {
  readonly newPassword: string;
  readonly oldPassword: string;
}

export interface UpdateUserDto {
  readonly id: number;
  readonly firstname: string;
  readonly surname: string;
  readonly birthday: DateAsString;
  readonly emailAddress: string;
  readonly role: UserGlobalRole;
  readonly activated: boolean;
  readonly forcePasswordChange: boolean;
  readonly password?: string;
}

export interface CreateWaiterDto {
  readonly name: string;
  readonly activated: boolean;
  readonly eventIds: number[];
  readonly organisationId: number;
}

export interface DuplicateWaiterResponse {
  readonly name: string;
  readonly waiters: IdAndNameResponse[];
}

export interface GetWaiterMinResponse {
  readonly id: number;
  readonly name: string;
}

export interface GetWaiterMyselfResponse {
  readonly id: number;
  readonly name: string;
  readonly organisationId: number;
  readonly organisationName: string;
  readonly eventIds: number[];
}

export interface GetWaiterResponse {
  readonly id: number;
  readonly name: string;
  readonly signInToken: string;
  readonly activated: boolean;
  readonly deleted: boolean;
  readonly organisationId: number;
  readonly events: number[];
}

export interface MergeWaiterDto {
  readonly waiterId: number;
  readonly waiterIds: number[];
}

export interface UpdateWaiterDto {
  readonly id: number;
  readonly activated: boolean;
  readonly name: string;
  readonly eventIds: number[];
  readonly updateToken?: boolean;
}

export interface WebSocketDto<T> {
  readonly messageObjectId: WebSocketMessageTypes;
  readonly httpStatus: number;
  readonly body: T;
}

export interface FileDto {
  readonly mime: string;
  readonly data: string;
}

export interface RegisterMediatorDto {
  readonly mediatorId: number;
}

export interface Mergeable<T> {}

export type DateAsString = string;

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
