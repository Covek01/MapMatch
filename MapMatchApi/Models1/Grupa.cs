namespace MapMatchApi.Models1
{
    public class Grupa
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Ime { get; set; } = string.Empty;
        [Required]
        public RegisteredUser Admin { get; set; } = null!;
        public List<RegisteredUser>? Clanovi { get; set; }
        public string? JoinCode { get; set; } = null!;

        [Required]
        public List<GroupMessage> GroupChat { get; set; } = null!;

    }
}
