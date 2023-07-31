using System.ComponentModel.DataAnnotations.Schema;

namespace MapMatchApi.Models
{
    
    public class DirectMessage
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public RegisteredUser Sender { get; set; } = null!;
        [Required]
        public RegisteredUser Receiver { get; set; }= null!;
        [Required]
        public DateTime SendTime { get; set; }
        [Required]
        public string Message { get; set; } = null!;

        [Required]
        public Friendship Chat { get; set; } = null!;



    }
}
