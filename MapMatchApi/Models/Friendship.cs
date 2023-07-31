using System.Text.Json.Serialization;

namespace MapMatchApi.Models
{
    public class Friendship
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public RegisteredUser? FriendshipOwner { get; set; }
        [Required]
        public RegisteredUser? Friend { get; set; }
        [Required]
        public DateTime FriendsSince { get; set; }
        [JsonIgnore]
        public List<DirectMessage> DirectChat { get; set; }=null!;

        public DateTime LastMessage { get; set; }
    }
}
