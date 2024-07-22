export class JWTUser {
  readonly _id: string;
  readonly isAdmin: boolean; 

  constructor(details: any) {
    this._id = details._id;
    this.isAdmin = details.isAdmin;  
  }

  getId(): string {
    return this._id;
  }
}

  