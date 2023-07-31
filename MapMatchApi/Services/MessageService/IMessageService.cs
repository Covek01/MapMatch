namespace MapMatchApi.Services.MessageService
{
    public interface IMessageService
    {
        public Task AddDirectMessage(int idSender, int idRec,string text);
        public Task<List<DirectMessageDTO>> GetAllDirectMessages(int idSender, int idRec);
        public Task<List<DirectMessageDTO>> GetAllDirectMessagesFromTo(int idSender, int idRec,int shiftFromLast, int number);



        public Task AddGroupMessage(int idSender, int idGroup,string text);
        public Task<List<GroupMessageDTO>> GetAllGroupMessages(int idSender, int idGroup);
        public Task<List<GroupMessageDTO>> GetAllGroupMessages(int idGroup);
        public Task<List<GroupMessageDTO>> GetAllGroupMessagesFromTo(int idSender, int idGroup,int shiftFromLast,int number);


        public Task AddPoll(int idGroup, int minsToLive, string pollName, string text);
        public Task<List<PollDTO>> GetAllGroupPolls(int idSender, int idGroup);

        public Task<PollDTO> VoteYes(int pollId);
        public Task<PollDTO> VoteNo(int pollId);

        public Task<List<ChatDTO>> RetrunAllChatsInOrder(int userId);
    }
}
