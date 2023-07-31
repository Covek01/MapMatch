namespace MapMatchApi.DTOs
{
    public class RequestView
    {
        public string SenderUsername { get; set; }
        public string ReceiverUsername { get; set;}
        public string SenderPhoto { get; set; }
        public DateTime SendTime { get; set; }
        public string Type { get; set; }
        public string RequestMessage { get; set; }
        public bool Active { get; set; }

        public Group ReferedGroup { get; set; }
        public int RefersToId { get; set; }
        public string RefersToUsername { get; set; }
        public string ReportMessage { get; set; }
    }
}
