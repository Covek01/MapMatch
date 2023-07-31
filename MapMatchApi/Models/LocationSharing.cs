namespace MapMatchApi.Models
{
    public class LocationSharing
    {
        [Key]
        public int Id { get; set; }
        public RegisteredUser? SharedTo { get; set; }
        public RegisteredUser? SharedFrom { get; set; }

        public DateTime timeOfShare { get; set; }

        public int durationInMinutes { get; set; }

    }
}
