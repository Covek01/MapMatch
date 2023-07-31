namespace MapMatchApi.DTOs
{
    public class DirectMessageDTO
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string SenderName { get; set; }
        public string ReceiverName { get; set; }
        public DateTime SendTime { get; set; }
        public string Text { get; set; }=string.Empty;

        public DirectMessageDTO()
        {

        }
        public DirectMessageDTO(DirectMessage dm)
        {
            this.SenderId = dm.Sender.Id;
            this.ReceiverId = dm.Receiver.Id;
            this.SendTime=dm.SendTime;
            this.Text = dm.Message;
            this.SenderName = dm.Sender.Username;
            this.ReceiverName = dm.Receiver.Username;
        }
    }
}
