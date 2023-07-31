export class LoginUser {
    constructor(user) {
      this.Id = user.id;
      this.FirstName = user.firstName;
      this.LastName = user.lastName;
      this.UserName=user.username;
      this.PasswordHash= user.passwordHash;
      this.Email=user.email;
      this.ProfilePhoto=user.profilePhoto;
      this.DateOfBirth=user.dateOfBirth;
      this.IsAdmin=user.isAdmin;
      this.IsVisible=user.isVisible;
      this.Latitude=user.latitude;
      this.Longitude=user.longitude;
      this.Token= user.token;

    }
  }