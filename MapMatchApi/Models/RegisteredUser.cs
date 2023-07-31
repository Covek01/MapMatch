using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using System.Text.Json.Serialization;

namespace MapMatchApi.Models
{
    public class RegisteredUser
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string PasswordHash { get; set; } = null!;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        public string Status { get; set; } = string.Empty;
   
        public List<LocationSharing>? SharedLocationTo { get; set; }
        public List<LocationSharing>? SharedLocationFrom { get; set; }

        public bool AccountVerified { get; set; }
        [Required]
        public string VerificationCode { get; set; }=string.Empty;

        public DateTime CreationTime { get; set; }
        public DateTime LastPasswordChange { get;set; }

        public string ProfilePhoto { get; set; }=string.Empty;
        [Required]
        public DateTime DateOfBirth { get; set; }
        public List<Friendship>? Friendships { get; set; }
        public List<Friendship>? IsFriendTo { get; set; }


        public List<Group>? GroupAdmin { get; set; }

        public List<Group>? GroupMemeber { get; set; } 
        public List<UserGroupVisibility>? GroupsVisibility { get; set; }

        public DateTime? SuspendedTill { get; set; }
        
        [Required]
        public bool IsAdmin { get; set; }
        [Required]
        public bool IsVisible { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public double? FutureLatitude { get; set; }
        public double? FutureLongitude { get; set; }

        [JsonIgnore]
        public List<Request>? SentRequests { get; set; }
        [JsonIgnore]
        public List<Request>? ReceivedRequests { get; set; }

        public List<Request>? ReferedTo { get; set; }

        public List<DirectMessage>? SentDirectMessages { get; set; }

        public List<DirectMessage>? ReceivedDirectMessages { get; set; }

        public List<GroupMessage>? SentGroupMessages { get; set; }





    }
}
