namespace MapMatchApi.Models1
{
    public class RegistrovaniKorisnik
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Ime { get; set; } = null!;
        [Required]
        public string Prezime { get; set; } = null!;
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string PasswordHash { get; set; } = null!;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public bool EmailConfirmed { get; set; }
        public string PhotoPath { get; set; } = null!;
        [Required]
        public DateTime DateOfBirth { get; set; }
        public List<Friendship>? Friendships { get; set; }
        public List<Friendship>? IsFriendTo { get; set; }

        public List<Group>? GroupAdmin { get; set; }

        public List<Group>? GroupMemeber { get; set; }

        public DateTime? SuspendedTill { get; set; }

        public int AccessFailedCount { get; set; }

        [Required]
        public bool IsAdmin { get; set; }
        [Required]
        public bool IsVisible { get; set; }

        public float? Latitude { get; set; }
        public float? Longitude { get; set; }

        public List<Request>? SentRequests { get; set; }
        public List<Request>? ReceivedRequests { get; set; }

        public List<Request>? ReferedTo { get; set; }

        public List<DirectMessage>? SentDirectMessages { get; set; }

        public List<DirectMessage>? ReceivedDirectMessages { get; set; }

        public List<GroupMessage>? SentGroupMessages { get; set; }
    }
}
