using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using System.Text.Json.Serialization;

namespace MapMatchApi.Models
{
    public class Group
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        [JsonIgnore]
        public RegisteredUser Admin { get; set; } = null!;
        [JsonIgnore]

        public List<RegisteredUser>? Members { get; set; }
        public string? JoinCode { get; set; } = null!;

        [Required]
        public  List<GroupMessage> GroupChat { get; set; }=null!;

        public string? PreferedColor { get; set; }

        public string? PhotoPath { get; set; }

        public List<Poll>? ListOfPolls { get; set; }

        [JsonIgnore]

        public List<UserGroupVisibility>? MemebersVisibility { get; set; }= null!;

        public DateTime LastMessage { get; set; }

    }
}
