export class OrganisationSettingsModel {
  public readonly activateWaiterOnSignInViaCreateToken: string;

  constructor(data: any) {
    this.activateWaiterOnSignInViaCreateToken = data.activate_waiter_on_sign_in_via_create_token;
  }
}
