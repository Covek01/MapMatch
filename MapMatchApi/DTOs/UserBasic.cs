namespace MapMatchApi.DTOs
{
    public class UserBasic
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string ProfilePhoto { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public bool IsVisible { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? futureLatitude { get; set; }
        public double? futureLongitude { get; set;}
    
        public UserBasic()
        {

        }
        public UserBasic(RegisteredUser user)
        {
            this.Id= user.Id;
            this.Status = user.Status;
            this.FirstName= user.FirstName;
            this.LastName= user.LastName;
            this.Username=user.Username;
            this.Email=user.Email;
            this.ProfilePhoto=user.ProfilePhoto;
            this.DateOfBirth = user.DateOfBirth;
            this.IsVisible = user.IsVisible;
            this.Latitude = user.Latitude;
            this.Longitude = user.Longitude;
            this.futureLatitude = user.FutureLatitude;
            this.futureLongitude = user.FutureLongitude;
        }
    }

}
