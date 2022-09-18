export class OrganisationSettingsModel {
  public readonly activateWaiterOnSignInViaCreateToken: string;

  constructor(data: any) {
    this.activateWaiterOnSignInViaCreateToken = data.activateWaiterOnSignInViaCreateToken;
  }
}
