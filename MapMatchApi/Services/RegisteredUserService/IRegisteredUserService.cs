using MailKit;
using Microsoft.AspNetCore.Mvc;

namespace MapMatchApi.Services.RegisteredUserService
{
    public interface IRegisteredUserService
    {
        string ExtendToken();
        Task<UserBasic> Registration([FromBody] RegistrationUser user);
        Task<UserBasic> VerifyUser(string email, string verificationCode);
        Task<UserInUse> LogIn([FromBody] LogInUser user);
        //Task<bool> ForgotPassword();
        Task<List<RegisteredUser>> GetAllUsers();
        Task<UserBasic> FindUserByUsername(string username);
        string GetMyUsername();
        string GetMyId();
        string GetMyRoles();
        //Task<string> GetMyRolesAsync();

        Task<bool> UserCanSeeUser(int idUser, string username);
        Task SetStatus(string status);
        Task<string> GetStatus(int idUser);
        Task ShareLocation(string fromUsername,string toUsername);
        Task<List<UserBasic>> GetSharedUsers(int userId);
        Task<UserBasic> GetMyInfo();
        Task<string> GetFullName(int idUser);
        Task<UserBasic> DeleteUserById(int id);
        Task<bool> SuspendUserById(int id,int numOfHours);
        Task<bool> GetIsVisibleValue(int id);
        Task<bool>ChangeIsVisible(int id);
        Task SetIsVisible(int id, bool visible);
        Task<bool> GetGroupVisibility(int userId, int groupId);
        Task<bool> ChangeGroupVisibility(int userId, int groupId);
        Task<List<UserBasic>> GetAllNearUsers(int id);
        Task<double[]> GetMyLocation();
        Task<bool> SetMyLocation(double longitude, double latitude);
        Task<double[]> GetLocation(int id);
        Task<bool>SetLocation(int id,double longitude, double latitude);

        Task<string> GetProfilePhoto(int id);
        Task<string> SetProfilePhoto(int id, string photo);

        Task<List<UserBasic>> GetAllFriendsLocation(int id);


        Task<UserBasic>GetFriendLocationByUsername(int id,string username);

        Task<List<UserBasic>> GetAllGroupMembersLocations(int groupId);

        Task<List<UserGroupDTO>> GetAllGroupMembersLocationsExceptId(int id,int groupId);


        Task<List<UserGroupsListDTO>> GetLocationsFromAllGroups(int id);

        Task<UserBasic> GetUserById(int id);
        Task<int> GetIdByUsername(string username);
        Task<int> GetUserIdByUsername(string username);
        bool MailAvaiable(string email);
        Task<bool> IsAdmin(int idUser);
        Task BanUser(int idUser, int numOfDays, int numOfHours);
        Task<bool> CheckIsUserBanned(int idUser);
        Task<int> GetIdFromUsername(string username);

        byte[] ReturnPicture(string path);

        //Task<List<RegisteredUser>>? ReturnFriends(int idUser);     //stojiljko

        // void AcceptFriendRequest(string senderNickname);      //stojiljko

        //Task<List<RegisteredUser>>? GetAllUsers([FromQuery] int id, [FromQuery] string? test = "");
        //Task<List<RegisteredUser>?>? AddUser([FromBody] RegisteredUser user);
        //Task<List<RegisteredUser>> DeleteUser([FromRoute] int id);

    }
}
