namespace MapMatchApi.DTOs
{
    public class UserGroupDTO
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
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
        public double? futureLongitude { get; set; }

        public string groupName { get; set; } 
        public int groupId { get; set; }
        public string groupColor { get; set; }

        public UserGroupDTO(RegisteredUser user,string groupName,int groupIds,string groupColor)
        {
            this.Id = user.Id;
            this.Status=user.Status;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;
            this.Username = user.Username;
            this.Email = user.Email;
            this.ProfilePhoto = user.ProfilePhoto;
            this.DateOfBirth = user.DateOfBirth;
            this.IsVisible = user.IsVisible;
            this.Latitude = user.Latitude;
            this.Longitude = user.Longitude;
            this.futureLatitude = user.FutureLatitude;
            this.futureLongitude = user.FutureLongitude;
            this.groupId = groupIds;
            this.groupName = groupName;
            this.groupColor = groupColor;
        }
    }
}
