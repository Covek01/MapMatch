namespace MapMatchApi.DTOs
{
    public class UserGroupsListDTO
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
        public double? futureLongitude { get; set; }

        public List<string> groupNames { get; set; } =new List<string>();
        public List<int> groupIds { get; set; }=new List<int>();
        public List<string> groupColors { get; set; }= new List<string>();

        public UserGroupsListDTO(UserGroupDTO user)
        {
            this.Id=user.Id;
            this.Status = user.Status;
            this.FirstName=user.FirstName;
            this.LastName=user.LastName;
            this.Username = user.Username;
            this.Email = user.Email;
            this.ProfilePhoto = user.ProfilePhoto;
            this.DateOfBirth = user.DateOfBirth;
            this.IsVisible = user.IsVisible;
            this.Latitude=user.Latitude;
            this.Longitude=user.Longitude;
            this.futureLongitude = user.futureLongitude;
            this.futureLatitude=user.futureLatitude;
            this.groupNames.Add(user.groupName);
            this.groupIds.Add(user.groupId);
            this.groupColors.Add(user.groupColor);

        }
       public static List<UserGroupsListDTO> Cons(List<UserGroupDTO> users)
        {
            if(users.Count==0||users==null)return new List<UserGroupsListDTO>();
            List<UserGroupsListDTO> returnList = new List<UserGroupsListDTO>();
            returnList.Add(new UserGroupsListDTO(users[0]));
            for (int i=1;i<users.Count; i++)
            {
                bool added = false;
                for(int j = 0; j < returnList.Count; j++)
                {
                    if (returnList[j].Id == users[i].Id)
                    {
                        returnList[j].groupNames.Add(users[i].groupName);
                        returnList[j].groupIds.Add(users[i].groupId);
                        returnList[j].groupColors.Add(users[i].groupColor);
                        added = true;
                    }
                   
                }
                if (!added)
                {
                    returnList.Add(new UserGroupsListDTO(users[i]));

                }
            }

            return returnList;
        }
    }
    
}
