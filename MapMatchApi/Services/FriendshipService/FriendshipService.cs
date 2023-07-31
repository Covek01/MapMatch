namespace MapMatchApi.Services.FriendshipService
{
    public class FriendshipService : IFriendshipService
    {
        private readonly DataContext _context;

        public FriendshipService(DataContext context)
        {
            _context = context;
        }
        public async Task InsertFriendship(int idSender, int idReceiver)
        {
            if (idSender == idReceiver)
            {
                throw new Exception("Sender and receiver are the same ones");
            }

            var sender = await _context.RegisteredUsers.Where(user => user.Id == idSender).FirstOrDefaultAsync();
            var receiver = await _context.RegisteredUsers.Where(user => user.Id == idReceiver).FirstOrDefaultAsync();

            if (sender == null || receiver == null)
            {
                throw new Exception("Users with these usernames don't exist");
            }
            
            if (await this.FriendshipExists(idSender, idReceiver))
            {
                throw new Exception("Friendship exists");
            }

            var friendship = new Friendship();
            friendship.FriendshipOwner = sender;
            friendship.Friend = receiver;
            friendship.DirectChat = new List<DirectMessage>();
            friendship.FriendsSince = DateTime.Now;
            friendship.LastMessage=DateTime.Now;

            try
            {
                await _context.Friendships.AddAsync(friendship);
                await _context.SaveChangesAsync();
            }
            catch(Exception ex) { throw new Exception(ex.ToString()); }
        }

        public async Task<List<RegisteredUser>> GetFriendsOfUser(int userId) 
        {
            try
            {
                var friends = await _context.Friendships
                    .Include(user => user.FriendshipOwner)
                    .Include(user => user.Friend)
                    .Where(user => user.FriendshipOwner.Id == userId || user.Friend.Id == userId)
                    .Select(f => (f.FriendshipOwner.Id == userId) ? f.Friend : f.FriendshipOwner)
                    .ToListAsync();

                return friends;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        private async Task<int> GetUserIdByUsername(string username)
        {
            var user = await _context.RegisteredUsers
                                .Where(user => user.Username == username)
                                .FirstOrDefaultAsync();
            if (user == null)
            {
                return -1;
            }

            return user.Id;
        }

        public async Task<List<RegisteredUser>> GetFriendsOfUser(string user)
        {
            int userId = await this.GetUserIdByUsername(user);

            var friends = await this.GetFriendsOfUser(userId);


            return friends;
        }

        public async Task<int> GetNumberOfFriendsForUser(int idUser) 
        {
            int numberOfFriends;
            try
            {
                numberOfFriends = await _context.Friendships
                                        .Include(x => x.FriendshipOwner)
                                        .Include(x => x.Friend)
                                        .Where(x => x.FriendshipOwner.Id == idUser || x.Friend.Id == idUser)
                                        .CountAsync();
            }
            catch(Exception ex) { throw new Exception("Bad connection with database"); }

            return numberOfFriends;
        }

        public async Task<List<RegisteredUser>> GetMutualFriends(int idUser1, int idUser2)
        {
            try
            {
                var friends1 = await this.GetFriendsOfUser(idUser1);
                var friends2 = await this.GetFriendsOfUser(idUser2);

                var mutualFriends = friends1.Intersect(friends2).ToList();

                return mutualFriends;                                
            }
            catch (Exception ex)
            { 
                throw new Exception("Bad connection with database");
            }
        }

        public async Task<int> GetNumberOfFriendsForUser(string user)
        {
            int idUser = await this.GetUserIdByUsername(user);
            int numberOfFriends;
            try
            {
                numberOfFriends = await _context.Friendships
                                            .Include(x => x.FriendshipOwner)
                                            .Include(x => x.Friend)
                                            .Where(x => x.FriendshipOwner.Id == idUser || x.Friend.Id == idUser)
                                            .CountAsync();
            }
            catch (Exception ex) { throw new Exception("Bad connection with database"); }

            return numberOfFriends;
        }

        public async Task DeleteFriendship(int idFriend1, int idFriend2)
        {
            if (!(await this.FriendshipExists(idFriend1, idFriend2)))
            {
                throw new Exception("Friendship doesn't exist");
            }

            try
            {
                var friendship = await _context.Friendships
                            .Include(x => x.FriendshipOwner)
                            .Include(x => x.Friend)
                            .Where(x => (x.FriendshipOwner.Id == idFriend1 && x.Friend.Id == idFriend2)
                            || (x.FriendshipOwner.Id == idFriend2 && x.Friend.Id == idFriend1))
                            .FirstOrDefaultAsync();

                var messages = await _context.DirectMessages
                                .Include(m => m.Sender)
                                .Include(m => m.Receiver)
                                .Where(m => m.Sender.Id == idFriend1 && m.Receiver.Id == idFriend2 
                                || m.Sender.Id == idFriend2 && m.Receiver.Id == idFriend1)
                                .ToListAsync();

                _context.RemoveRange(messages); //brise i poruke izmedju njih
                _context.Remove(friendship);
                await _context.SaveChangesAsync();
            }
            catch(Exception ex) { throw new Exception("Bad transaction while removing"); }
        }

        public async Task DeleteFriendship(string username1, string username2)
        {
            int idFriend1 = await this.GetUserIdByUsername(username1);
            int idFriend2 = await this.GetUserIdByUsername(username2);

            this.DeleteFriendship(idFriend1, idFriend2);
        }

        public async Task<bool> FriendshipExists(int idFriend1, int idFriend2)
        {
            bool flag = _context.Friendships
                            .Include(x => x.FriendshipOwner)
                            .Include(x => x.Friend)
                            .Where(x => (x.FriendshipOwner.Id == idFriend1 && x.Friend.Id == idFriend2)
                            || (x.FriendshipOwner.Id == idFriend2 && x.Friend.Id == idFriend1))
                            .Any();

            return flag;
        }

        public async Task<string> FriendshipRoomName(int idFriend1, int idFriend2)
        {
            var friendship = await _context.Friendships
                                    .Include(x => x.FriendshipOwner)
                                    .Include(x => x.Friend)
                                    .Where(x => (x.FriendshipOwner.Id == idFriend1 && x.Friend.Id == idFriend2)
                                    || (x.FriendshipOwner.Id == idFriend2 && x.Friend.Id == idFriend1))
                                    .FirstOrDefaultAsync();

            return friendship.FriendshipOwner.Username + friendship.Friend.Username;
        }

        public async Task<List<UserBasic>> GetNonMutualFriends(int hasFriends, int notHaveFriends)
        {
            var hasF = await _context.RegisteredUsers
                .Where(u => u.Id == hasFriends)
                .FirstOrDefaultAsync();
            if (hasF == null) throw new Exception("Invalid User Id");

            var noF = await _context.RegisteredUsers
                .Where(u => u.Id == notHaveFriends)
                .FirstOrDefaultAsync();
            if (noF == null) throw new Exception("Invalid User Id");

            var allFriends = _context.Friendships
                .Include(f => f.FriendshipOwner)
                .Include(f => f.Friend)
                .Where(f => f.FriendshipOwner.Id == hasFriends || f.Friend.Id == hasFriends);

            var excluded = _context.Friendships
                .Include(f => f.FriendshipOwner)
                .Include(f => f.Friend)
                .Where(f => f.FriendshipOwner.Id == notHaveFriends || f.Friend.Id == notHaveFriends);

            var owner =await allFriends.
                Where(f => f.FriendshipOwner.Id != hasFriends)
                .Select(f=>f.FriendshipOwner)
                .ToListAsync();
            var owned = await allFriends.
                Where(f => f.Friend.Id != hasFriends)
                .Select(f => f.Friend)
                .ToListAsync() ;

            List < RegisteredUser > listFriends=new List<RegisteredUser>();
            if (owner != null && owner.Count != 0)
            {
                listFriends.AddRange(owner);
            }
            if (owned != null && owned.Count != 0)
            {
                listFriends.AddRange(owned);
            }



            var ownerEx = await excluded.
                Where(f => f.FriendshipOwner.Id != notHaveFriends)
                .Select(f => f.FriendshipOwner)
                .ToListAsync();
            var ownedEx = await excluded.
                Where(f => f.Friend.Id != notHaveFriends)
                .Select(f => f.Friend)
                .ToListAsync();

            List<RegisteredUser> listExcluded = new List<RegisteredUser>();
            if (ownerEx != null && ownerEx.Count != 0)
            {
                listExcluded.AddRange(ownerEx);
            }
            if (ownedEx != null && ownedEx.Count != 0)
            {
                listExcluded.AddRange(ownedEx);
            }


            var result =listFriends.Except(listExcluded).ToList();

            List<UserBasic> returnList = new List<UserBasic>();

            foreach(var r in result)
            {
                if(r.Id!=hasFriends&&r.Id!=notHaveFriends)
                returnList.Add(new UserBasic(r));
            }







            return returnList;
        }
    }
}
