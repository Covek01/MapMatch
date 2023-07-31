namespace MapMatchApi.Models1
{
    public class Prijateljstvo
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public RegisteredUser? FriendshipOwner { get; set; }
        [Required]
        public RegisteredUser? Friend { get; set; }
        [Required]
        public DateTime FriendsSince { get; set; }

        public List<DirectMessage> DirectChat { get; set; } = null!;
    }
}
