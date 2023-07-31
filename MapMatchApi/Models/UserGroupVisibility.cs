namespace MapMatchApi.Models
{
    public class UserGroupVisibility
    {
        [Key]
        public int Id { get; set; }

        public Group Grupa { get; set; } = null!;

        public RegisteredUser User { get; set; } = null!;

        public bool isVisible { get; set; }
    }
}
