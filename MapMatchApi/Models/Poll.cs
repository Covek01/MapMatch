namespace MapMatchApi.Models
{
    public class Poll
    {
        [Key]
        public int Id { get; set; }

        public string PollName { get; set; } = string.Empty;

        [Required]
        public DateTime TimeOfCreate { get; set; }

        public int TimeToLive { get; set; }
        public string Text { get; set; }= string.Empty;

        [Required]
        public Group MyGroup { get; set; } = null!;
        [Required]
        public int NumberOfYes { get; set; }
        [Required]
        public int NumberoOfNo { get; set; }



    }
}
