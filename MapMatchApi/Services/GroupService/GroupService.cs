using MapMatchApi.Services.EmailService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace MapMatchApi.Services.GroupService
{
    public class GroupService : IGroupService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailservice;
        private static Random random = new Random();

        private static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public GroupService(DataContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IEmailService emailservice)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _emailservice = emailservice;
        }

        public async Task<Group> CreateGroup( GroupBasic group)
        {
            group.PhotoPath=group.PhotoPath == string.Empty || group.PhotoPath == null ? "https://i.imgur.com/Jm9qkNv.jpg" : group.PhotoPath;
            var admin = await _context.RegisteredUsers
                .Include(u=>u.GroupAdmin)
                .Include(u=>u.GroupMemeber)
                .Include(u=>u.GroupsVisibility)
                .Where(u => u.Id == group.AdminId)
                .FirstOrDefaultAsync();
            if(admin == null)
            {
                throw new Exception("Invalid User Id");
            }
            Group g1 = new Group();
            g1.Name = group.Name;

            g1.Admin = admin;
            g1.Members = new List<RegisteredUser>();
            g1.JoinCode = RandomString(8);
            g1.GroupChat = new List<GroupMessage>();
            g1.PreferedColor = group.PreferedColor;
            g1.PhotoPath = group.PhotoPath;
            g1.ListOfPolls = new List<Poll>();
            g1.MemebersVisibility = new List<UserGroupVisibility>();
            g1.LastMessage = DateTime.Now;

            UserGroupVisibility ugv = new UserGroupVisibility();
            ugv.User = admin;
            ugv.isVisible = false;
            ugv.Grupa = g1;

            g1.MemebersVisibility.Add(ugv);

            admin.GroupAdmin.Add(g1);
            admin.GroupMemeber.Add(g1);
            admin.GroupsVisibility.Add(ugv);


            await _context.Groups.AddAsync(g1);
            await _context.UserGroupVisibilities.AddAsync(ugv);
            await _context.SaveChangesAsync();

            return g1;
        }

        public async Task<List<UserBasic>> AddUser(int userId, int groupId)
        {
            var user = await _context.RegisteredUsers
                .Include(u=>u.GroupMemeber)
                .Include(u=>u.GroupsVisibility)
                .Where(u => u.Id == userId)
                .FirstOrDefaultAsync();

            if (user == null) throw new Exception("Invalid User Id");

            var group=await _context.Groups
                .Include(g=>g.Members)
                .Include(g=>g.MemebersVisibility)
                .Where(g=>g.Id==groupId)
                .FirstOrDefaultAsync();

            if (group == null) throw new Exception("Invalid Group Id");


            user.GroupMemeber.Add(group);
            group.Members.Add(user);

            UserGroupVisibility ugv1 = new UserGroupVisibility();
            ugv1.User = user;
            ugv1.Grupa = group;
            ugv1.isVisible = true;

            user.GroupsVisibility.Add(ugv1);
            group.MemebersVisibility.Add(ugv1);

            await _context.AddAsync(ugv1);
            await _context.SaveChangesAsync();

            return await GetAllGroupUsers(groupId);
        }

        public async Task<List<UserBasic>> GetAllGroupUsers(int groupId)
        {
            var usersFromGroup = await _context.Groups
                .Where(g => g.Id == groupId)
                .Select(m => m.Members).FirstOrDefaultAsync();

            if (usersFromGroup == null) return new List<UserBasic>();
            List<UserBasic> members = new List<UserBasic>();
            foreach(var u in usersFromGroup)
            {
                members.Add(new UserBasic(u));
            }
            return members;
        }

        public async Task<List<UserBasic>> RemoveUser(int userId, int groupId)
        {
            var user = await _context.RegisteredUsers
                .Include(u=>u.GroupMemeber)
                .Include(u=>u.GroupsVisibility)
                .Where(u => u.Id == userId)
                .FirstOrDefaultAsync();
            if (user == null) throw new Exception("Invalid User Id");

            var group = await _context.Groups
                .Include(g=>g.MemebersVisibility)
                .Include(g=>g.Members)
                .Where(g => g.Id == groupId)
                .FirstOrDefaultAsync();
            if (group == null) throw new Exception("Invalid Group Id");

            var ugv = await _context.UserGroupVisibilities
                .Where(v => v.User.Id == userId && v.Grupa.Id == groupId)
                .FirstOrDefaultAsync();

            if (group.Admin.Id == user.Id)
            {
                await DeleteGroup(groupId);
                return new List<UserBasic>();
            }

            user.GroupMemeber.Remove(group);
            user.GroupsVisibility.Remove(ugv);
            group.Members.Remove(user);
            group.MemebersVisibility.Remove(ugv);

            _context.UserGroupVisibilities.Remove(ugv);

            await _context.SaveChangesAsync();

            return await GetAllGroupUsers(groupId);

            
        }

        public async Task<string> GetCode(int groupId)
        {
            var code =await _context.Groups
                .Where(g => g.Id == groupId)
                .Select(g=>g.JoinCode)
                .FirstOrDefaultAsync();

            if (code == string.Empty) return string.Empty;
            return code;

        }

        public async Task<string> GenerateNewCode(int groupId)
        {
            int groupWithSameCode = 0;
            string code = "tempcode";
            do
            {
                code = RandomString(8);
                groupWithSameCode = _context.Groups
                    .Where(g => g.JoinCode == code)
                    .Count();

            } while (groupWithSameCode != 0);
            var group = await _context.Groups
                .Where(g => g.Id == groupId)
                .FirstOrDefaultAsync();
            if (group == null) throw new Exception("Invalid Group Id");

            if (group.JoinCode == string.Empty) throw new Exception("Join code disabled");

            group.JoinCode = code;
            await _context.SaveChangesAsync();

            return code;
        }

        public async Task<string> GetGroupPhoto(int groupId)
        {
            var groupPhoto = await _context.Groups
               .Where(g => g.Id == groupId)
               .Select(g=>g.PhotoPath)
               .FirstOrDefaultAsync();

            if (groupPhoto == null)
            {
                groupPhoto = "./Images/default.jpg";
            }
            return groupPhoto;
        }

        public async Task<string> SetGroupPhoto(int groupId, string path)
        {
            var group = await _context.Groups
                .Where(g => g.Id == groupId)
                .FirstOrDefaultAsync();

            if (group == null) throw new Exception("Invalid Group Id");

            group.PhotoPath = path;
            await _context.SaveChangesAsync();

            return group.PhotoPath;

        }

        public async Task DisableCode(int groupId)
        {
            var groupCode = await _context.Groups
                .Where(g => g.Id == groupId)
                .FirstOrDefaultAsync();

            if (groupCode == null) throw new Exception("Invalid Group Id");

            if (groupCode.JoinCode == string.Empty) throw new Exception("Already disabled");

            groupCode.JoinCode= string.Empty;
            await _context.SaveChangesAsync();

        }

        public async Task<string> EnableCode(int groupId)
        {
            var groupCode = await _context.Groups
                .Where(g => g.Id == groupId)
                .FirstOrDefaultAsync();

            if (groupCode == null) throw new Exception("Invalid Group Id");

            if (groupCode.JoinCode != string.Empty) throw new Exception("Already enabled");

            groupCode.JoinCode = "temp";
            await _context.SaveChangesAsync();
            return await GenerateNewCode(groupId);
        }

        public async Task DeleteGroup(int groupId)
        {
            var group = await _context.Groups
                .Where(g => g.Id == groupId)
                .FirstOrDefaultAsync();

            if (group == null) throw new Exception("Invalid Group Id");
            
            var users = await _context.Groups
                .Include(u=>u.Members)
                .ThenInclude(u=>u.GroupMemeber)
                .Include(u => u.Members)
                .ThenInclude(u=>u.GroupsVisibility)
                .Include(u => u.Members)
                .ThenInclude(u=>u.GroupAdmin)
                .Where(g => g.Id == groupId)
                .Select(u => u.Members)
                .FirstOrDefaultAsync();
            if (users == null||users.Count==0) return;

            foreach(var u in users)
            {
                u.GroupMemeber.Remove(group);
                u.GroupAdmin.Remove(group);
                var ugv = await _context.UserGroupVisibilities
                    .Where(v => v.Grupa.Id == groupId && v.User.Id == u.Id)
                    .FirstOrDefaultAsync();
                u.GroupsVisibility.Remove(ugv);
                _context.UserGroupVisibilities.Remove(ugv);
            }


            _context.Groups.Remove(group);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UserInGroup(int userId, int groupId)
        {
            var groupMembers = await _context.Groups
                .Include(g=>g.Members)
                .Where(g => g.Id == groupId)
                .Select(g=>g.Members)
                .FirstOrDefaultAsync();

            if (groupMembers == null) throw new Exception("Invalid Group Id");

            foreach(var g in groupMembers)
            {
                if (g.Id == userId) return true;
            }
            return false;

        }

        public async Task<List<UserBasic>> FriendsNotInGroup(int groupId)
        {
            List<UserBasic> returnList = new List<UserBasic>();


            var group = await _context.Groups
                .Include(g => g.Members)
                .Include(g=>g.Admin)
                .Where(g => g.Id == groupId)
                .FirstOrDefaultAsync();
            if (group == null) throw new Exception("Invalid Group Id");


            var user = group.Admin;

            var friends1 = await _context.Friendships
                .Include(f => f.Friend)
                .Where(f => f.FriendshipOwner.Id == user.Id)
                .Select(f=>f.Friend)
                .ToListAsync();

            var friends2 = await _context.Friendships
                .Include(f => f.FriendshipOwner)
                .Where(f => f.Friend.Id == user.Id)
                .Select(f=>f.FriendshipOwner)
                .ToListAsync();

            foreach(var f in friends1)
            {
                if (!group.Members.Contains(f))
                    returnList.Add(new UserBasic(f));
            }
            foreach(var f in friends2)
            {
                if (!group.Members.Contains(f))
                    returnList.Add(new UserBasic(f));
            }

            return returnList;
                


        }
        public async Task<GroupBasic> JoinGroupCode(string code, int userId)
        {
            if (code == string.Empty) throw new Exception("Invalid code");

            var group = await _context.Groups
                .Include(g=>g.Members)
                .Where(g => g.JoinCode == code)
                .FirstOrDefaultAsync();

            var user = await _context.RegisteredUsers
                .Include(u=>u.GroupMemeber)
                .Include(g=>g.GroupAdmin)
                .Where(u => u.Id == userId)
                .FirstOrDefaultAsync();
            if (user == null) throw new Exception("Invalid User id");
            if (group == null) throw new Exception("Nonexistant code");

            if (user.GroupAdmin.Contains(group) || user.GroupMemeber.Contains(group))
            {
                throw new Exception("Already a member");
            }

            user.GroupMemeber.Add(group);
            group.Members.Add(user);

            await _context.SaveChangesAsync();

            return new GroupBasic(group);



        }

        public async Task<GroupBasic> GetGroupById(int idGroup)
        {
            try
            {
                var group = await _context.Groups
                    .Include(g=>g.Admin)
                                    .Where(group => group.Id == idGroup)
                                    .FirstOrDefaultAsync();
                if (group == null)
                {
                    throw new Exception("Wrong ID");
                }

                GroupBasic groupReturn = new GroupBasic(group);
                return groupReturn;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<List<GroupBasic>> GetGroupsByUserId(int idUser)
        {
            try
            {
                var user = await _context.RegisteredUsers
                                        .Where(user => user.Id == idUser)
                                        .FirstOrDefaultAsync();
                if (user == null)
                {
                    throw new Exception("Wrong ID");
                }

                List<Group> groups = await _context.Groups
                                    .Include(group => group.Members)
                                    .Where(group => group.Members.Contains(user))
                                    .ToListAsync();
                
                List<GroupBasic> groupsReturn = new List<GroupBasic>();

                foreach(var group in groups)
                {
                    groupsReturn.Add(new GroupBasic(group));
                }
                return groupsReturn;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<int> GetGroupAdmin(int groupId)
        {
            var group = await _context.Groups
                .Include(g => g.Admin)
                .Where(g => g.Id == groupId)
                .FirstOrDefaultAsync();

            if (group == null) throw new Exception("Invalid Group Id");

            var adminId = group.Admin.Id;

            return adminId;

        }
    }
}
