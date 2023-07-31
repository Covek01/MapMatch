using System.Text.Json.Serialization;

namespace MapMatchApi.Models
{
    public class Request
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public RegisteredUser? Sender { get; set; }

        [Required]
        public RegisteredUser? Receiver { get; set; }
        [Required]
        public DateTime SendTime { get; set; }

        [Required]
        public string Type { get; set; } = null!; //Friend request, group invite, report,location share (report se ne bira kome se salje direktno,
                                                  //controller ce da ga prosledi nasumicno
        public Group? InvitedToJoinGroup{get;set;}
        public RegisteredUser? RefersTo { get; set; }//za report i za location share

        public string? RequestMessage { get; set; }//Text koji stize uz zahtev

        public bool Active { get; set; }//da li je obradjen (pirhvacen f req, pregledan report, ...
        public bool isSpam { get; set; }//alive se koristi da se spreci spammovanje zahtevima,
                                       //za f req alive je 24h i tek onda mozes opet istoj osobi da posaljes
    }
}
