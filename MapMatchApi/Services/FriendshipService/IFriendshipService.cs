namespace MapMatchApi.Services.FriendshipService
{
    public interface IFriendshipService
    {
        Task InsertFriendship(int idOwner, int idFriend);
        Task DeleteFriendship(int idOwner, int idFriend);
        Task DeleteFriendship(string username1, string username2);

        Task<List<RegisteredUser>> GetFriendsOfUser(int idUser);
        Task<List<RegisteredUser>> GetFriendsOfUser(string user);
        Task<List<RegisteredUser>> GetMutualFriends(int idUser1, int idUser2);
        Task<List<UserBasic>> GetNonMutualFriends(int hasFriends, int notHaveFriends);
        Task<int> GetNumberOfFriendsForUser(int idUser);
        Task<int> GetNumberOfFriendsForUser(string user);
        Task<bool> FriendshipExists(int idFriend1, int idFriend2);
        Task<string> FriendshipRoomName(int idFriend1, int idFriend2);
    }
}
