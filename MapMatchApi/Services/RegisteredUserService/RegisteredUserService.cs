using MapMatchApi.Services.EmailService;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.VisualBasic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MapMatchApi.Services.RegisteredUserService
{
    public class RegisteredUserService : IRegisteredUserService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailservice;

        public RegisteredUserService(DataContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _emailservice = emailService;
        }

        public async Task<UserBasic> Registration(RegistrationUser user)
        {
            int minPassLen = 8;

            var alreadyExists = await _context.RegisteredUsers
                 .CountAsync(p => p.Username == user.Username);
            if (alreadyExists > 0) throw new Exception("Username already exists");

            alreadyExists = await _context.RegisteredUsers
                .CountAsync(p => p.Email == user.Email);
            if (alreadyExists > 0) throw new Exception("Mail already used for an account");


            bool containsAtLeasteOneUpper = user.Password.Any(char.IsUpper);
            if (!containsAtLeasteOneUpper) throw new Exception("Password must have at least one upper case");
            if (user.Password.Length < minPassLen) throw new Exception($"Password too short. Minimum length {minPassLen} characters");
            bool containsAtLeasteOneNumber = user.Password.Any(char.IsNumber);
            if (!containsAtLeasteOneNumber) throw new Exception("Password must have at leaste one number");

            DateTime now = DateTime.Now;
            int age = now.Year - user.DateOfBirth.Year;
            if (user.DateOfBirth > now.AddYears(-age))
                age--;

            if (age < 14) throw new Exception("User must be at least 14");


            string passwrodHash = BCrypt.Net.BCrypt.HashPassword(user.Password);

            byte[] tokenBytes = Guid.NewGuid().ToByteArray();
            var codeEncoded = WebEncoders.Base64UrlEncode(tokenBytes);


            var userToRegister = new RegisteredUser()
            {
                Username = user.Username,
                PasswordHash = passwrodHash,
                Email = user.Email,
                AccountVerified = false,
                VerificationCode = codeEncoded,
                Status="Hello I'm using MapMatch",
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePhoto = "https://i.imgur.com/Jm9qkNv.jpg",
                DateOfBirth = user.DateOfBirth,
                CreationTime = DateTime.Now,
                LastPasswordChange=DateTime.Now,
                Friendships = new List<Friendship>(),
                IsFriendTo = new List<Friendship>(),
                GroupAdmin = new List<Models.Group>(),
                GroupMemeber = new List<Models.Group>(),
                GroupsVisibility = new List<UserGroupVisibility>(),
                SuspendedTill = null,
                IsAdmin = user.IsAdmin,
                IsVisible = false,
                Latitude = null,
                Longitude = null,
                FutureLatitude = null,
                FutureLongitude = null,
                SentRequests = new List<Request>(),
                ReceivedRequests = new List<Request>(),
                ReferedTo = new List<Request>(),
                SentDirectMessages = new List<DirectMessage>(),
                ReceivedDirectMessages = new List<DirectMessage>(),
                SentGroupMessages = new List<GroupMessage>(),
                SharedLocationTo=new List<LocationSharing>(),
                SharedLocationFrom=new List<LocationSharing>()
            };


            await _context.RegisteredUsers.AddAsync(userToRegister);
            await _context.SaveChangesAsync();
            _emailservice.RegistrationConfirmationEmail(userToRegister, codeEncoded);
            return new UserBasic(userToRegister);

        }
        public async Task<UserInUse> LogIn([FromBody] LogInUser user)
        {
            var userIzBaze = await _context.RegisteredUsers
                .Where(p => p.Username == user.Username&&p.AccountVerified==true)
               // .Where(p => p.SuspendedTill == null ||p.SuspendedTill<DateTime.Now)
                .FirstOrDefaultAsync();
            
            if (userIzBaze == null) throw new Exception("Username or Password wrong.");

            if (!userIzBaze.AccountVerified) throw new Exception("Username or Password wrong.");

            if (!BCrypt.Net.BCrypt.Verify(user.Password, userIzBaze.PasswordHash))
            {
                throw new Exception("Username or Password wrong.");
            }

            if (userIzBaze.SuspendedTill != null && userIzBaze.SuspendedTill > DateTime.Now)
            {
                throw new Exception("Account suspended");

            }

            string token = CreateToken(userIzBaze);
            UserInUse returnValue = new UserInUse(userIzBaze,token);
            return returnValue;
        }


        private string CreateToken(RegisteredUser user)
        {
            string role;
            if (user.IsAdmin) { 
                role = "admin";
            }
            else
            {
                role = "user";
            }
            List<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role,role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(6),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public async Task<List<RegisteredUser>> GetAllUsers()
        {
            return await _context.RegisteredUsers.ToListAsync();
        }

        public string GetMyUsername()
        {
            var result = string.Empty;
            if (_httpContextAccessor.HttpContext != null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
            }
            else
            {
                throw new Exception("Tokren error");
            }
            return result!;
        }

        public string GetMyId()
        {
            var result = string.Empty;
            if(_httpContextAccessor.HttpContext != null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            }
            else
            {
                throw new Exception("Token error");
            }

            return result!;
        }

        public string GetMyRoles()
        {
            var result = string.Empty;
            if(_httpContextAccessor.HttpContext != null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
            }
            else
            {
                throw new Exception("Token error");
            }

            return result;
        }

        //public Task<string> GetMyRolesAsync()
        //{
            
        //    if (_httpContextAccessor.HttpContext != null)
        //    {
        //        var result = await _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
        //        return result;
        //    }
        //    else
        //    {
        //        throw new Exception("Token error");
        //    }


        //}

        public async Task<UserBasic> DeleteUserById(int id)
        {
            var userToDelete =await _context.RegisteredUsers
                 .Where(p => p.Id == id).FirstOrDefaultAsync();

            if (userToDelete == null)
                throw new Exception("Invalid user Id");

            var friendships1 = await _context.Friendships//
                 .Where(f => f.FriendshipOwner.Id == id)
                 .ToListAsync();

            var friendships2 = await _context.Friendships//
                .Where(f => f.Friend.Id == id)
                .ToListAsync();

            var sentDM = await _context.DirectMessages//
                .Where(d => d.Sender.Id == id)
                .ToListAsync();

            var recvDM = await _context.DirectMessages//
                .Where(d => d.Receiver.Id == id)
                .ToListAsync();

            var sentGM = await _context.GroupMessages//
                .Where(g => g.Sender.Id == id)
                .ToListAsync();

            var ugv = await _context.UserGroupVisibilities//
                .Where(u => u.User.Id == id)
                .ToListAsync();

            var sentReq = await _context.Requests//
                .Where(r => r.Sender.Id == id)
                .ToListAsync();

            var recvReq = await _context.Requests//
                .Where(r => r.Receiver.Id == id)
                .ToListAsync();

            var referedReq = await _context.Requests//
              .Where(r => r.RefersTo.Id == id)
              .ToListAsync();

            var groups = await _context.Groups
                .Include(g=>g.GroupChat)
                .Where(g => g.Admin.Id == id)
                .ToListAsync();

            if (sentDM.Count != 0)
            {
                foreach(var s in sentDM)
                {
                    _context.DirectMessages.Remove(s);
                }
            }

            if (recvDM.Count != 0)
            {
                foreach (var s in recvDM)
                {
                    _context.DirectMessages.Remove(s);
                }
            }
            if (sentGM.Count != 0)
            {
                foreach (var s in sentGM)
                {
                    _context.GroupMessages.Remove(s);
                }
            }

            if (ugv.Count != 0)
            {
                foreach(var u in ugv)
                {
                    _context.UserGroupVisibilities.Remove(u);
                }
            }

            if (sentReq.Count != 0)
            {
                foreach(var s in sentReq)
                {
                    _context.Requests.Remove(s);
                }
            }

            if (recvReq.Count != 0)
            {
                foreach (var s in recvReq)
                {
                    _context.Requests.Remove(s);
                }
            }

            if (referedReq.Count != 0)
            {
                foreach (var s in referedReq)
                {
                    _context.Requests.Remove(s);
                }
            }

            if (groups.Count != 0)
            {
                foreach(var g in groups)
                {
                    foreach(var gm in g.GroupChat)
                    {
                        _context.GroupMessages.Remove(gm);
                    }
                    _context.Groups.Remove(g);
                }
            }

            if (friendships1.Count != 0)
            {
                foreach(var f in friendships1)
                {
                    _context.Friendships.Remove(f);
                }
            }

            if (friendships2.Count != 0)
            {
                foreach (var f in friendships2)
                {
                    _context.Friendships.Remove(f);
                }
            }



            _context.RegisteredUsers.Remove(userToDelete);
            await _context.SaveChangesAsync();
            return new UserBasic(userToDelete);
        }

        public async Task<bool> SuspendUserById(int id,int numHours)
        {
            var userToSuspend = await _context.RegisteredUsers
                .Where(u => u.Id == id).FirstOrDefaultAsync();
            if(userToSuspend == null)
            {
                throw new Exception("Invalid used Id");
            }
            userToSuspend.SuspendedTill=(DateTime.Now.AddHours(numHours));
            await _context.SaveChangesAsync();

            return true;

        }


        public async Task<UserBasic> VerifyUser(string email,string verificationCode)
        {
            var userToVerify =await _context.RegisteredUsers
                .Where(p => p.Email == email && p.VerificationCode == verificationCode)
                .FirstOrDefaultAsync();

            if(userToVerify == null)
            {
                throw new Exception("Confirmation fail");
            }
            var protekloVreme = (userToVerify.LastPasswordChange - DateTime.Now).TotalHours;
            if (protekloVreme > 24)
            {
                 _context.RegisteredUsers.Remove(userToVerify);
                await _context.SaveChangesAsync();
                throw new Exception("Confirmation expired");
            }

       
            userToVerify.AccountVerified = true;
            await _context.SaveChangesAsync();
            return new UserBasic(userToVerify);
        }

        public async Task<UserBasic> FindUserByUsername(string username)
        {
            var user= await _context.RegisteredUsers
                .Where(p => p.Username == username).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new Exception("User Not Found");
            }
            return new UserBasic(user);
        }


        public async Task<bool> GetIsVisibleValue(int id)
        {
            var user=await _context.RegisteredUsers
                .Where(p=>p.Id==id)
                .Select(p=>new
                {
                    p.IsVisible
                })
                .FirstOrDefaultAsync();

            if (user == null) throw new Exception("Invalid id");
            return user.IsVisible;
        }

        public async Task<bool> ChangeIsVisible(int id)
        {
            var user = await _context.RegisteredUsers
                .Where(p => p.Id == id).FirstOrDefaultAsync();

            if (user == null) throw new Exception("Invalid Id");

            user.IsVisible=!user.IsVisible;
            await _context.SaveChangesAsync();
           
            return user.IsVisible;
        }

        public async Task SetIsVisible(int id, bool visible)
        {
            var user = await _context.RegisteredUsers
                .Where(p => p.Id == id).FirstOrDefaultAsync();

            if (user == null) throw new Exception("Invalid Id");

            user.IsVisible = visible;
            await _context.SaveChangesAsync();
        }


        //1 stepen longitude i latidue je okok 111km
        public async Task<List<UserBasic>> GetAllNearUsers(int id)
        {
            float distance = 50f;//+- 50 m
            float distanceInCoords = distance / 111000;

            var userLocationCheck = await _context.RegisteredUsers
                .Where(p => p.Id == id).FirstOrDefaultAsync();
            if (userLocationCheck == null) 
            {
                throw new Exception("Invalid Id"); 
            }
            if(!userLocationCheck.IsVisible)
            {
                throw new Exception("Location turned off");
            }
            if (userLocationCheck.Longitude == null || userLocationCheck.Latitude == null)
                throw new Exception("Location unaviable");

            var nearUsers = await _context.RegisteredUsers
                .Where(p => p.Id != id &&
                p.IsVisible == true &&
                p.Longitude != null &&
                p.Latitude != null &&
                (Math.Abs((decimal)(p.Latitude - userLocationCheck.Latitude)) <= (decimal)distanceInCoords) &&
                (Math.Abs((decimal)(p.Longitude - userLocationCheck.Longitude)) <= (decimal)distanceInCoords)).ToListAsync();

            List<UserBasic> returnNearUsers= new List<UserBasic>();
            foreach (var user in nearUsers)
            {
                returnNearUsers.Add(new UserBasic(user));
            }
            return returnNearUsers;



        }

        public Task<double[]> GetMyLocation()
        {
            throw new NotImplementedException();

        }

        public Task<bool> SetMyLocation(double longitude, double latitude)
        {
            throw new NotImplementedException();
        }

        public async Task<double[]> GetLocation(int id)
        {
            double[] location = new double[2];

            var loc = await _context.RegisteredUsers
                .Where(p => p.IsVisible == true && p.Id == id)
                .Select(p => new
                {
                    p.Longitude,
                    p.Latitude
                }).FirstOrDefaultAsync();
            if (loc == null) throw new Exception("Cant get location for specified id");
            if (loc.Latitude == null || loc.Longitude == null) throw new Exception("Location unavaiable");
            location[0] = (double)loc.Longitude;
            location[1] = (double)loc.Latitude;

            return location;
        }

        public async Task<bool> SetLocation(int id, double longitude, double latitude)
        {
            var user = await _context.RegisteredUsers
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();
            if (user == null) throw new Exception("Invalid id");

            user.Latitude = latitude;
            user.Longitude = longitude;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> GetProfilePhoto(int id)
        {
            var path = await _context.RegisteredUsers
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.ProfilePhoto
                }).FirstOrDefaultAsync();
            if (path == null) throw new Exception("Invalid id");
            return path.ProfilePhoto;
        }

        public async Task<string> SetProfilePhoto(int id, string photo)
        {
            var user = await _context.RegisteredUsers
                .Where(p => p.Id == id).FirstOrDefaultAsync();

            if(user==null)throw new Exception("Invalid id");

            user.ProfilePhoto = photo;
            await _context.SaveChangesAsync();

            return photo;
        }

        public async Task<List<UserBasic>> GetAllFriendsLocation(int id)
        {
            List<List<double>> lokacije = new List<List<double>>();
            var user=await _context.RegisteredUsers
                .Where(p=>p.Id==id).FirstOrDefaultAsync();
            if (user == null) throw new Exception("Invalid Id");

            var friends1 = await _context.Friendships
                .Include(p=>p.Friend)
                .Where(p => p.FriendshipOwner!.Id == id && p.Friend!.IsVisible == true && (p.Friend.Longitude != null && p.Friend.Latitude != null))
                .Select(p =>p.Friend).ToListAsync();


            var friends2 = await _context.Friendships
                .Include(p=>p.FriendshipOwner)
               .Where(p => p.Friend!.Id == id && p.FriendshipOwner!.IsVisible == true && (p.FriendshipOwner.Longitude != null && p.FriendshipOwner.Latitude != null))
               .Select(p => p.FriendshipOwner).ToListAsync();


            List<UserBasic> returnFriends = new List<UserBasic>();
            foreach (var f in friends1) {
                returnFriends.Add(new UserBasic(f));
            }
            foreach (var f in friends2)
            {
                returnFriends.Add(new UserBasic(f));
            }

            return returnFriends;
        }

        public async Task<UserBasic> GetFriendLocationByUsername(int id, string username)
        {
            var friend1 = await _context.Friendships
                .Include(p => p.Friend)
                .Include(p => p.FriendshipOwner)
                .Where(p => (p.Friend!.Id == id && p.FriendshipOwner!.Username == username))
                .FirstOrDefaultAsync();


            var friend2 = await _context.Friendships
                .Include(p => p.FriendshipOwner)
                .Include(p => p.Friend)
                .Where(p => p.FriendshipOwner!.Id == id && p.Friend!.Username == username)
                .FirstOrDefaultAsync();

            if (friend1 == null && friend2 == null) throw new Exception("Specified Id and Username are not friends");
            if (friend1 != null && (friend1.FriendshipOwner.IsVisible == false||friend1.FriendshipOwner.Latitude==null||friend1.FriendshipOwner.Longitude==null))
            {
                throw new Exception("Friends location turned off");
            }
            else if(friend1!=null)
            {
                return new UserBasic(friend1.FriendshipOwner);
            }

            if (friend2 != null && (friend2.Friend.IsVisible == false || friend2.Friend.Latitude == null || friend2.Friend.Longitude == null))
            {
                throw new Exception("Friends location turned off");
            }
            else if(friend2!= null)
            {
                return new UserBasic(friend2.Friend);
            }

            throw new Exception("Bad Implementation");
        }

        public async Task<List<UserBasic>> GetAllGroupMembersLocations(int groupId)
        {
            var lokacijeClanovaGrupe = await _context.UserGroupVisibilities
                .Include(p => p.User)
                .Include(p => p.Grupa)
                .Where(p => p.Grupa.Id == groupId && p.isVisible == true&&p.User.IsVisible&&p.User.Latitude!=null&&p.User.Longitude!=null)
                .ToListAsync();

            //  List<List<double>> lokacije = new List<List<double>>();
            List<UserBasic> groupMembers = new List<UserBasic>();
            foreach(var user in lokacijeClanovaGrupe)
            {
                groupMembers.Add(new UserBasic(user.User));
            }
            return groupMembers;
        }

        public async Task<List<UserGroupDTO>> GetAllGroupMembersLocationsExceptId(int id, int groupId)
        {
            var lokacijeClanovaGrupe = await _context.UserGroupVisibilities
                .Include(p => p.User)
                .Include(p => p.Grupa)
                .Where(p => p.Grupa.Id == groupId && p.isVisible == true && p.User.IsVisible && p.User.Latitude != null && p.User.Longitude != null)
                .Where(p=>p.User.Id!=id)
                .ToListAsync();



            //  List<List<double>> lokacije = new List<List<double>>();
            List<UserGroupDTO> groupMembers = new List<UserGroupDTO>();

            foreach (var user in lokacijeClanovaGrupe)
            {
                groupMembers.Add(new UserGroupDTO(user.User,user.Grupa.Name,user.Grupa.Id,user.Grupa.PreferedColor==null?"blue":user.Grupa.PreferedColor));

            }
            return groupMembers;
        }

        public async Task<List<UserGroupsListDTO>> GetLocationsFromAllGroups(int id)
        {
            var groups = await _context.RegisteredUsers
                .Include(p => p.GroupMemeber)
                .Where(p => p.Id == id)
                .Select(p => p.GroupMemeber).FirstOrDefaultAsync();

            

            List<List<UserGroupDTO>> lokacijeUsers = new List<List<UserGroupDTO>>();
            if (groups == null||groups.Count==0) return new List<UserGroupsListDTO>();

            //foreach (var group in groups) 
            //{
            //    lokacijeUsers[group.]
            //    lokacije.AddRange(await GetAllGroupMembersLocationsExceptId(id, gourp.Id));
            //}
            lokacijeUsers = new List<List<UserGroupDTO>>(groups.Count);
            for (int i = 0; i < groups.Count; i++)
            {
                lokacijeUsers.Add(new List<UserGroupDTO>());
                lokacijeUsers[i].AddRange(await GetAllGroupMembersLocationsExceptId(id, groups[i].Id));
            }
            List<UserGroupDTO> pom = new List<UserGroupDTO>();
            foreach(var niz in lokacijeUsers)
            {
                pom.AddRange(niz);
            }
            return UserGroupsListDTO.Cons(pom);
        }

        public async Task<bool> GetGroupVisibility(int userId, int groupId)
        {
            var vis = await _context.UserGroupVisibilities
                .Where(v => v.Grupa.Id == groupId && v.User.Id == userId)
                .Select(v => v.isVisible)
                .FirstOrDefaultAsync();

            return vis;
        }

        public async Task<bool> ChangeGroupVisibility(int userId, int groupId)
        {
            var vis = await _context.UserGroupVisibilities
            .Where(v => v.Grupa.Id == groupId && v.User.Id == userId)
            .FirstOrDefaultAsync();

            if (vis == null) throw new Exception("User not part of group");
            vis.isVisible = !vis.isVisible;

            await _context.SaveChangesAsync();
            return vis.isVisible;

        }



        ////simetricnaLogika
        //public async Task<List<RegisteredUser>>? ReturnFriends(int idUser)
        //{
        //    if (_context.RegisteredUsers.Any(user => user.Id == idUser) == false)
        //    {
        //        return null;
        //    }
        //    var friendships = await  _context.Friendships
        //                                .Include(x => x.FriendshipOwner)
        //                                .Include(x => x.Friend)
        //                                .Where(user => user.FriendshipOwner.Id == idUser || user.Friend.Id == idUser)
        //                                .Select(row => (row.FriendshipOwner.Id == idUser) ?
        //                                /*   new
        //                                   {
        //                                       row.Friend.Id,
        //                                       row.Friend.Username,
        //                                       row.Friend.PhotoPath,
        //                                       row.Friend.FirstName,
        //                                       row.Friend.LastName
        //                                   }
        //                                   : new
        //                                   {
        //                                       row.FriendshipOwner.Id,
        //                                       row.FriendshipOwner.Username,
        //                                       row.FriendshipOwner.PhotoPath,
        //                                       row.FriendshipOwner.FirstName,
        //                                       row.FriendshipOwner.LastName
        //                                   });*/
        //                                row.Friend : row.FriendshipOwner)
        //                                .ToListAsync();

        //    return friendships;
        //}

        //stojiljko
        //prihvata se zahtev za prijateljstvo i upisuje u friendships tabelu
        public async void AcceptFriendRequest(string senderUsername, string receiverUsername)

        {
            var req = await _context.Requests
                                            .Include(p => p.Sender)
                                            .Where(user => user.Sender.Username == senderUsername
                                            && user.Receiver.Username == receiverUsername)
                                            .FirstOrDefaultAsync();
            if (req == null) { throw new Exception("Request with specified sender doesn't exist"); }
            var sender = await _context.RegisteredUsers
                                    .Where(user => user.Username == req.Sender.Username)
                                    .FirstOrDefaultAsync();
            var receiver = await _context.RegisteredUsers
                                    .Where(user => user.Username == req.Receiver.Username)
                                    .FirstOrDefaultAsync();
            try
            {
                var friendship = new Friendship { FriendshipOwner = sender,
                    Friend = receiver, FriendsSince = DateTime.Now };
                await _context.Friendships.AddAsync(friendship);
                
                _context.Requests.Remove(req);
            }
            catch(Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<UserBasic> GetUserById(int id)
        {
            RegisteredUser user = await _context.RegisteredUsers.FindAsync(id);

            return new UserBasic(user);
        }

        public async Task<int> GetUserIdByUsername(string username)
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
        public bool MailAvaiable(string email)
        {
            int m = _context.RegisteredUsers
                .Where(u => u.Email == email)
                .Count();

            if (m != 0) return false;

            return true;
        }

        public byte[] ReturnPicture(string path)
        {
            FileInfo fileInfo=new FileInfo(path);

            byte[] pic = new byte[fileInfo.Length];

            using (FileStream fs = fileInfo.OpenRead())
            {
                fs.Read(pic,0,pic.Length);
            }

            return pic;

        }

        public string ExtendToken()
        {
            var id = string.Empty;
            var userName = string.Empty;
            var role = string.Empty;
            if (_httpContextAccessor.HttpContext != null)
            {
                id = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                userName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
                role = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
            }
            else
            {
                throw new Exception("Tokren error");
            }

           

            if (id == string.Empty || userName == string.Empty || role == string.Empty||
                id==null||userName==null||role==null)
            {
                throw new Exception("Token error");
            }
            
            List<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier,id),
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Role,role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(6),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;

        }
        
        public async Task<string> GetFullName(int idUser)
        {
            
            
            
                var user = await _context.RegisteredUsers
                                .Where(user => user.Id == idUser)
                                .FirstOrDefaultAsync();
                if(user==null) { throw new Exception("Invalid user ID"); }
            
            
            

            return user.FirstName + " " + user.LastName;
        }

        public async Task<int> GetIdByUsername(string username)
        {
            try
            {
                var user = await _context.RegisteredUsers
                                        .Where(user => user.Username == username)
                                        .FirstOrDefaultAsync();

                if (user==null)
                {
                    throw new Exception("There isn't username with this username");
                }

                return user.Id;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<UserBasic> GetMyInfo()
        {
            var result = string.Empty;
            if (_httpContextAccessor.HttpContext != null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            }
            else
            {
                throw new Exception("Token error");
            }

            //UserBasic return= new UserBasic();
            var me=await _context.RegisteredUsers
                .Where(u=>u.Id==Int32.Parse(result))
                .FirstOrDefaultAsync();

            UserBasic returnValue = new UserBasic(me);
            return returnValue;
        }

        public async Task SetStatus(string status)
        {
            var result = string.Empty;
            if (_httpContextAccessor.HttpContext != null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            }
            else
            {
                throw new Exception("Token error");
            }

            //UserBasic return= new UserBasic();
            var me = await _context.RegisteredUsers
                .Where(u => u.Id == Int32.Parse(result))
                .FirstOrDefaultAsync();
            me.Status = status;
            await _context.SaveChangesAsync();
        }

        public async Task<string> GetStatus(int idUser)
        {
            var user=await _context.RegisteredUsers
                .Where(u=>u.Id==idUser)
                .FirstOrDefaultAsync();
            if (user == null) throw new Exception("Invalid User Id");

            return user.Status;
        }


        public async Task<bool> IsAdmin(int idUser)
        {
            var user = await _context.RegisteredUsers
                .Where(u => u.Id == idUser)
                .FirstOrDefaultAsync();

            if (user == null) throw new Exception("User doeesn't exist");

            return user.IsAdmin;
        }

        public async Task ShareLocation(string fromUsername, string toUsername)
        {
            var from = await _context.RegisteredUsers
                .Where(f => f.Username == fromUsername)
                .FirstOrDefaultAsync();

            if (from == null) throw new Exception("Invalid User Username");

            var to = await _context.RegisteredUsers
                .Where(t => t.Username == toUsername)
                .FirstOrDefaultAsync();

            if (to == null) throw new Exception("Invalid User Username");

            LocationSharing ls = new LocationSharing()
            {
                SharedTo = to,
                SharedFrom = from,
                timeOfShare = DateTime.Now,
                durationInMinutes = 15
            };

            if (from.SharedLocationTo == null)
                from.SharedLocationTo = new List<LocationSharing>();
            if (from.SharedLocationFrom == null)
                from.SharedLocationFrom = new List<LocationSharing>();
            if (to.SharedLocationTo == null)
                to.SharedLocationTo = new List<LocationSharing>();
            if (to.SharedLocationFrom == null)
                to.SharedLocationFrom = new List<LocationSharing>();

            from.SharedLocationTo.Add(ls);
            to.SharedLocationFrom.Add(ls);

            await _context.AddAsync(ls);
           await  _context.SaveChangesAsync();

        }

        public async Task<List<UserBasic>> GetSharedUsers(int userId)
        {
            var Sharers = await _context.LocationSharings
                .Include(l => l.SharedFrom)
                .Where(l => l.SharedTo != null && l.SharedTo.Id == userId)
                .ToListAsync();

            if (Sharers == null) throw new Exception("Invalid User Id");
            
            List<LocationSharing> validSharers = new List<LocationSharing>();
            List<LocationSharing> deleteSharers = new List<LocationSharing>();

            for(int i = 0; i < Sharers.Count; i++)
            {
                if (Sharers[i].timeOfShare.AddMinutes(Sharers[i].durationInMinutes) >= DateTime.Now)
                {
                    validSharers.Add(Sharers[i]);
                }
                else
                {
                    deleteSharers.Add(Sharers[i]);
                }
            }

            //var sharersCleanup = await _context.LocationSharings
            //    .Where(l => l.SharedTo != null && l.SharedTo.Id == userId && (l.timeOfShare.AddMinutes(l.durationInMinutes)) < DateTime.Now)
            //    .ToListAsync();



            _context.LocationSharings.RemoveRange(deleteSharers);
            await _context.SaveChangesAsync();
            List<UserBasic> sharers = new List<UserBasic>();
            foreach(var s in validSharers)
            {

                sharers.Add(new UserBasic(s.SharedFrom));
            }

            return sharers;


        }

        public async Task BanUser(int idUser, int numOfDays, int numOfHours)
        {
            try
            {
                var user = await _context.RegisteredUsers
                                .Where(user => user.Id == idUser)
                                .FirstOrDefaultAsync();

                var dateNow = DateTime.Now;
                var dateOfBanExtension = DateTime.Now.Add(new TimeSpan(numOfDays, numOfHours, 0, 0, 0));

                user.SuspendedTill = dateOfBanExtension;

                await _context.SaveChangesAsync();
            }
            catch(Exception ex) 
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<int> GetIdFromUsername(string username)
        {
            try
            {
                var user = await _context.RegisteredUsers
                                .Where(user => user.Username == username)
                                .FirstOrDefaultAsync();

                return user.Id;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }


        public async Task<bool> CheckIsUserBanned(int userId)
        {
            try
            {
                var flag = await _context.RegisteredUsers
                                .Where(user => user.Id == userId && user.SuspendedTill != null)
                                .AnyAsync();

                return flag;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }


        public async Task<bool> UserCanSeeUser(int idUser, string username)
        {
            var userMap = await _context.RegisteredUsers
                .Where(u => u.Username == username)
                .FirstOrDefaultAsync();


            if (userMap == null) return false;

            int idMap = userMap.Id;
            
            var user = await _context.RegisteredUsers
                .Where(u => u.Id == idUser)
                .FirstOrDefaultAsync();

            if (user == null) throw new Exception("Invalid User Id");

            var friends=await GetAllFriendsLocation(idUser);
            var fromGroups = await GetLocationsFromAllGroups(idUser);
            var nears = await GetAllNearUsers(idUser);
            var shared = await GetSharedUsers(idUser);

            if (friends != null)
            {
                foreach(var f in friends)
                {
                    if (f.Id == idMap)
                    {
                        return true;
                    }
                }
            }

            if (fromGroups != null)
            {
                foreach(var g in fromGroups)
                {
                    if(g.Id == idMap)
                    {
                        return true;
                    }
                }
            }

            if(nears != null)
            {
                foreach(var n in nears)
                {
                    if(n.Id== idMap)
                    {
                        return true;
                    }
                }
            }

            if(shared != null) 
            {
                foreach(var s in shared)
                {
                    if (s.Id == idMap)
                    {
                        return true;
                    }
                }
            }


            return false;
        }


        ////asimetricaLogika
        //public async Task<List<RegisteredUser>> ReturnFriendsAsimetric() //stojiljko
        //{
        //    return null;
        //}
        ////public Task<List<RegisteredUser>?>? AddUser([FromBody] RegisteredUser user)
        ////{
        ////    if (user is null)
        ////    {
        ////        return null; 
        ////            }
        ////    _context.RegisteredUsers.AddAsync(user);
        ////    return _context.RegisteredUsers.ToListAsync()!;
        ////}

        ////public async Task<List<RegisteredUser>> DeleteUser([FromRoute] int id)
        ////{
        ////    var user = _context.RegisteredUsers.Where(p => p.Id == id).FirstOrDefault();
        ////    _context.RegisteredUsers.Remove(user!);
        ////    await _context.SaveChangesAsync();
        ////    return await _context.RegisteredUsers.ToListAsync();
        ////}

        ////public Task<List<RegisteredUser>>? GetAllUsers([FromQuery] int id, [FromQuery] string? test = "")
        ////{
        ////    var user = _context.RegisteredUsers
        ////       .Where(p => p.Id == id)
        ////       .Select(p => new
        ////       {
        ////           Ime = p.FirstName,
        ////           Prezime = p.LastName
        ////       });

        ////    if (user.Count() == 0)
        ////        return null;

        ////    return _context.RegisteredUsers.ToListAsync();

        ////}

    }
}
