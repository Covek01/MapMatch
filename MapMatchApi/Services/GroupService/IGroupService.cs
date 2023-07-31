using Microsoft.AspNetCore.Mvc;

namespace MapMatchApi.Services.GroupService
{
    public interface IGroupService
    {
        Task<int> GetGroupAdmin(int groupId);
        Task<Group> CreateGroup(GroupBasic group);
        Task DeleteGroup(int groupId);
        Task<List<UserBasic>> AddUser(int userId,int groupId);
        Task<List<UserBasic>> GetAllGroupUsers(int groupId);
        Task<GroupBasic> GetGroupById(int groupId);
        Task<List<GroupBasic>> GetGroupsByUserId(int userId);

        Task<List<UserBasic>> RemoveUser(int userId,int groupId);
        Task<string> GetCode(int groupId);
        Task<string> GenerateNewCode(int groupId);

        Task DisableCode(int groupId);

        Task<string> EnableCode(int groupId);
        Task<string> GetGroupPhoto(int groupId);
        Task<string> SetGroupPhoto(int groupId,string path);

        Task<bool> UserInGroup(int userId,int groupId);
        Task<List<UserBasic>> FriendsNotInGroup(int groupId);

        Task<GroupBasic> JoinGroupCode(string code, int userId);
    }
}
