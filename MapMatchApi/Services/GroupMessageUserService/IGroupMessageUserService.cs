//Stojiljko
namespace MapMatchApi.Services.GroupMessageUserService
{
    public interface IGroupMessageUserService
    {
        public Task<GroupMessage> GetGroupMessagesForGroup(int groupId);
        public void InsertGroupMessageInDatabase(GroupMessageDTO groupMessage);
        public void InsertGroupMessagesInDatabase(List<GroupMessageDTO> groupMessages);
    }
}
