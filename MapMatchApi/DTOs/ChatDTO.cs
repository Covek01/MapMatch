namespace MapMatchApi.DTOs
{
    public class ChatDTO
    {
        public int id { get; set; }
        public string name { get; set; } = string.Empty;
        public string photo { get; set; } = string.Empty;
        public DateTime lastMessageTime { get; set; }
        public string tip { get; set; } = string.Empty;

        public int recvId { get; set; }

        public int groupOrFriendshipId { get; set; }
        public int groupUserId { get; set; }

        public ChatDTO(Friendship f,int index,string friendName,string friendPhoto,int recvId)
        {
            this.id = index;
            this.name = friendName;
            this.photo = friendPhoto;
            this.lastMessageTime = f.LastMessage;
            this.tip = "direct";
            this.recvId = recvId;
            this.groupOrFriendshipId = f.Id;
            this.groupUserId = -1;
        }

        public ChatDTO(Group g, int index,int recvId) 
        {
            this.id = index;
            this.name = g.Name;
            this.photo = g.PhotoPath;
            this.lastMessageTime = g.LastMessage;
            this.tip = "group";
            this.recvId = recvId;
            this.groupOrFriendshipId= g.Id;
            this.groupUserId = g.Id;
        }
    }
}
