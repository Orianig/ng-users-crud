export class User {
  constructor(
    public id = '',
    public userName = '',
    public fullName = '',
    public email = '',
    public jobTitle = '',
    public phoneNumber = '',
  ) {
  }

  get friendlyName() {
    let name = this.fullName || this.userName;

    if (this.jobTitle) {
      name = this.jobTitle + ' ' + name;
    }

    return name;
  }

  public isEnabled = true;
}
