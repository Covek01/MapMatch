//Stojiljko
using Microsoft.AspNetCore.Http.HttpResults;

namespace MapMatchApi.Services.GroupMessageUserService
{
    public class GroupMessageUserService : IGroupMessageUserService
    {
        public Task<GroupMessage> GetGroupMessagesForGroup(int groupId)
        {
            throw new NotImplementedException();
        }

        public void InsertGroupMessageInDatabase(GroupMessageDTO groupMessage)
        {

        }

        public void InsertGroupMessagesInDatabase(List<GroupMessageDTO> groupMessages)
        {

        }
    }
}
