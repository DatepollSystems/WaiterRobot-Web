/* tslint:disable */
/* eslint-disable */

// Generated using typescript-generator version 2.35.1025 on 2022-03-24 12:09:45.

export interface CreateAllergenDto {
  readonly name: string;
  readonly shortName: string;
  readonly global: boolean | null;
}

export interface CreateEventOrLocationDto {
  readonly name: string;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly date: Date | null;
  readonly organisationId: number;
}

export interface CreateMediatorDto {
  readonly address: string;
  readonly name: string;
  readonly pdfCreator: boolean;
  readonly organisationId: number;
}

export interface CreateOrganisationDto {
  readonly name: string;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly countryCode: string;
}

export interface CreatePrinterDto {
  readonly name: string;
  readonly printerName: string;
  readonly eventId: number;
  readonly mediatorId: number;
}

export interface CreateProductDto {
  readonly name: string;
  readonly allergenIds: number[];
  readonly price: number;
  readonly groupId: number;
  readonly printerId: number | null;
}

export interface CreateProductGroupDto {
  readonly name: string;
  readonly eventId: number;
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

export interface CreateUserDto {
  readonly firstname: string;
  readonly surname: string;
  readonly birthday: Date;
  readonly emailAddress: string;
  readonly password: string;
  readonly activated: boolean;
  readonly role: UserGlobalRole;
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

export interface GetAllergenResponse {
  readonly id: number;
  readonly name: string;
  readonly shortName: string;
}

export interface GetEventOrLocationResponse {
  readonly id: number;
  readonly name: string;
  readonly date: string | null;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly waiterCreateToken: string;
  readonly organisationId: number;
}

export interface GetMediatorResponse {
  readonly id: number;
  readonly name: string;
  readonly address: string;
  readonly pdfCreator: boolean;
  readonly organisationId: number;
  readonly printers: number[];
}

export interface GetMyselfResponse {
  readonly id: number;
  readonly emailAddress: string;
  readonly firstname: string;
  readonly surname: string;
  readonly birthday: Date;
  readonly role: UserGlobalRole;
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

export interface GetPrinterResponse {
  readonly id: number;
  readonly name: string;
  readonly eventId: number;
  readonly mediatorId: number;
  readonly mediatorName: string;
  readonly productGroups: number[];
}

export interface GetProductGroupResponse {
  readonly id: number;
  readonly name: string;
  readonly printerId: number | null;
  readonly eventId: number;
}

export interface GetProductResponse {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly groupId: number;
  readonly groupName: string;
  readonly allergens: GetAllergenResponse[];
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

export interface GetUserResponse {
  readonly id: number;
  readonly firstname: string;
  readonly surname: string;
  readonly emailAddress: string;
  readonly activated: boolean;
  readonly forcePasswordChange: boolean;
  readonly birthday: Date;
  readonly role: UserGlobalRole;
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

export interface ISignInDto {
  readonly stayLoggedIn: boolean;
  readonly authIdentifier: string;
  readonly sessionInformation: string;
}

export interface ISignInWithPasswordChangeDto extends ISignInWithPasswordDto {
  readonly newPassword: string;
  readonly oldPassword: string;
}

export interface DefaultImpls {}

export interface ISignInWithPasswordDto extends ISignInDto {
  readonly password: string;
}

export interface JWTResponse {
  readonly token: string | null;
  readonly sessionToken: string | null;
}

export interface LogoutDto {
  readonly sessionToken: string;
}

export interface MergeWaiterDto {
  readonly waiterId: number;
  readonly waiterIds: number[];
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

export interface RefreshJWTWithSessionTokenDto {
  readonly sessionToken: string;
  readonly sessionInformation: string;
}

export interface SessionResponse {
  readonly id: number;
  readonly description: string;
  readonly entityId: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface SignInWithPasswordChangeDto extends ISignInWithPasswordChangeDto {
  readonly email: string;
}

export interface UpdateAllergenDto {
  readonly id: number;
  readonly name: string;
  readonly shortName: string;
  readonly global: boolean | null;
}

export interface UpdateEmailDto {
  readonly emailAddress: string;
}

export interface UpdateEventOrLocationDto {
  readonly id: number;
  readonly name: string;
  readonly street: string;
  readonly streetNumber: string;
  readonly postalCode: string;
  readonly city: string;
  readonly date: Date | null;
  readonly updateWaiterCreateToken: boolean | null;
}

export interface UpdateMediatorDto {
  readonly id: number;
  readonly address: string;
  readonly name: string;
  readonly pdfCreator: boolean;
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

export interface UpdatePasswordDto {
  readonly newPassword: string;
  readonly oldPassword: string;
}

export interface UpdatePrinterDto {
  readonly id: number;
  readonly name: string;
  readonly printerName: string;
  readonly eventId: number;
  readonly mediatorId: number;
}

export interface UpdateProductDto {
  readonly id: number;
  readonly name: string;
  readonly allergenIds: number[];
  readonly price: number;
  readonly groupId: number;
  readonly printerId: number | null;
}

export interface UpdateProductGroupDto {
  readonly id: number;
  readonly name: string;
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

export interface UpdateUserDto {
  readonly id: number;
  readonly firstname: string;
  readonly surname: string;
  readonly birthday: Date;
  readonly emailAddress: string;
  readonly role: UserGlobalRole;
  readonly activated: boolean;
  readonly forcePasswordChange: boolean;
  readonly password: string | null;
}

export interface UpdateWaiterDto {
  readonly id: number;
  readonly activated: boolean;
  readonly name: string;
  readonly eventIds: number[];
  readonly updateToken: boolean | null;
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

export type UserGlobalRole = 'ADMIN' | 'USER';

export type UserOrganisationRole = 'ADMIN' | 'MEMBER';
