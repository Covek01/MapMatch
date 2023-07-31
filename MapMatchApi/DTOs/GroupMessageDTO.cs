namespace MapMatchApi.DTOs
{
    public class GroupMessageDTO
    {
        public int SenderId { get; set; }
        public string SenderUsername { get;set; }
        public string Message { get; set; }=string.Empty;
        public int GroupId { get; set; }

        public DateTime SendTime { get; set; }

        public GroupMessageDTO()
        {

        }
        public GroupMessageDTO(GroupMessage gm)
        {
            this.SenderId = gm.Sender.Id;
            this.Message = gm.Message;
            this.GroupId = gm.Group.Id;
            this.SendTime = gm.SendTime;
            this.SenderUsername=gm.Sender.Username;
        }

    }
}
