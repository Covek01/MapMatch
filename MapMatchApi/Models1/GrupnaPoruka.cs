namespace MapMatchApi.Models1
{
    public class GrupnaPoruka
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public RegisteredUser Sender { get; set; } = null!;
        [Required]
        public DateTime SendTime { get; set; }
        [Required]
        public string Message { get; set; } = null!;

        [Required]
        public Group Group { get; set; } = null!;
    }
}
