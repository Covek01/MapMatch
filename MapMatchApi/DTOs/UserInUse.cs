namespace MapMatchApi.DTOs
{
    public class UserInUse
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Username { get; set; } = null!;
       // public string PasswordHash { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string ProfilePhoto { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsVisible { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public string Token { get; set; }

        public UserInUse(RegisteredUser user,string token)
        {
            this.Id=user.Id;
            this.FirstName=user.FirstName;
            this.LastName=user.LastName;
            this.Username=user.Username;
          //  this.PasswordHash=user.PasswordHash;
            this.Email=user.Email;
            this.ProfilePhoto=user.ProfilePhoto;
            this.DateOfBirth=user.DateOfBirth;
            this.IsAdmin=user.IsAdmin;
            this.IsVisible=user.IsVisible;
            this.Latitude=user.Latitude;
            this.Longitude=user.Longitude;
            this.Token = token;
        }
    }
}
