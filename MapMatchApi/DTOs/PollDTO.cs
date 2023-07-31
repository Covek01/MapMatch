namespace MapMatchApi.DTOs
{
    public class PollDTO
    {
        public string PollName { get; set; } = string.Empty;

        public DateTime SendTime { get; set; }

        public int TimeToLive { get; set; }

        public string Text { get; set; } = string.Empty;
        public int GroupId { get; set; }
        public int NumberOfYes { get; set; }
        public int NumberOfNo { get; set;}

        public PollDTO()
        {

        }

        public PollDTO(Poll p)
        {
            this.PollName= p.PollName;
            this.SendTime = p.TimeOfCreate;
            this.TimeToLive = p.TimeToLive;
            this.Text = p.Text;
            this.NumberOfNo = p.NumberoOfNo;
            this.NumberOfYes = p.NumberOfYes;
            this.GroupId = p.MyGroup.Id;
        }

    }
}
