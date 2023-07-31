using MapMatchApi.Services.EmailService;
using System.Drawing;

namespace MapMatchApi.Services.MessageService
{
    public class MessageService:IMessageService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailservice;

        public MessageService(DataContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IEmailService emailservice)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _emailservice = emailservice;
        }

        public async Task AddDirectMessage(int idSender, int idRec,string text)
        {
            DirectMessage dm = new DirectMessage();
            var sender = await _context.RegisteredUsers
                .Include(u=>u.SentDirectMessages)
                .Where(u => u.Id == idSender)
                .FirstOrDefaultAsync();
            if(sender== null)
            {
                throw new Exception("Invalid User Id");
            }

            var receiver = await _context.RegisteredUsers
              .Include(u=>u.ReceivedDirectMessages)
              .Where(u => u.Id == idRec)
              .FirstOrDefaultAsync();
            if (receiver == null)
            {
                throw new Exception("Invalid User Id");
            }
            var friendShip=await _context.Friendships
                .Include(f=>f.DirectChat)
                .Where(f=>f.FriendshipOwner.Id==idSender&&f.Friend.Id==idRec||f.FriendshipOwner.Id==idRec&&f.Friend.Id==idSender)
                .FirstOrDefaultAsync();

            if(friendShip==null)
            {
                throw new Exception("Users are not friends");
            }

            dm.Sender = sender;
            dm.Receiver = receiver;
            dm.Message = text;
            dm.SendTime = DateTime.Now;
            dm.Chat = friendShip;


            sender.SentDirectMessages.Add(dm);
            receiver.ReceivedDirectMessages.Add(dm);

            friendShip.DirectChat.Add(dm);
            friendShip.LastMessage = dm.SendTime;

            await _context.SaveChangesAsync();

        }

        public async Task AddGroupMessage(int idSender, int idGroup,string text)
        {
            GroupMessage gm = new GroupMessage();

            var sender = await _context.RegisteredUsers
                .Include(u => u.SentGroupMessages)
                .Where(u => u.Id == idSender)
                .FirstOrDefaultAsync();
            if (sender == null) throw new Exception("Invalid User Id");
            var group = await _context.Groups
                .Include(g => g.GroupChat)
                .Where(g => g.Id == idGroup)
                .FirstOrDefaultAsync();
            if (group == null) throw new Exception("Invalid Group Id");

            gm.Sender = sender;
            gm.SendTime=DateTime.Now;
            gm.Message = text;
            gm.Group= group;

            sender.SentGroupMessages.Add(gm);

            group.GroupChat.Add(gm);
            group.LastMessage=gm.SendTime;

            await _context.SaveChangesAsync();

           
        }

        public async Task AddPoll(int idGroup,int minsToLive,string pollName,string text)
        {
            Poll poll = new Poll();
            var group = await _context.Groups
                .Include(g => g.ListOfPolls)
                .Where(g => g.Id == idGroup)
                .FirstOrDefaultAsync();

            if (group == null) throw new Exception("Invalid Group Id");

            poll.PollName = pollName;
            poll.Text = text;
            poll.TimeOfCreate=DateTime.Now;
            poll.TimeToLive = minsToLive;
            poll.MyGroup = group;
            poll.NumberOfYes = 0;
            poll.NumberoOfNo = 0;

            group.ListOfPolls.Add(poll);
            group.LastMessage = poll.TimeOfCreate;

            await _context.SaveChangesAsync();
            
        }

        public async Task<List<DirectMessageDTO>> GetAllDirectMessages(int idSender, int idRec)
        {
            List<DirectMessageDTO>mess=new List<DirectMessageDTO>();

            var messages = await _context.DirectMessages
                .Include(m=>m.Sender)
                .Include(m=>m.Receiver)
                .Where(m => m.Sender.Id == idSender && m.Receiver.Id == idRec || m.Sender.Id == idRec && m.Receiver.Id == idSender)
                .OrderBy(m => m.SendTime)
                .ToListAsync();

            foreach(var m in messages)
            {
                mess.Add(new DirectMessageDTO(m));
            }
            return mess;

        }

        public async Task<List<DirectMessageDTO>> GetAllDirectMessagesFromTo(int idSender, int idRec, int shiftFromLast, int number)
        {
            List<DirectMessageDTO> mess = new List<DirectMessageDTO>();

            var messagesAll =  _context.DirectMessages
                .Include(m=>m.Sender)
                .Include(m=>m.Receiver)
                .Where(m => m.Sender.Id == idSender && m.Receiver.Id == idRec || m.Sender.Id == idRec && m.Receiver.Id == idSender)
                .OrderBy(m => m.SendTime);

            int c= (messagesAll.Count() - shiftFromLast - number )> 0? messagesAll.Count() - shiftFromLast - number:0;
            var messages= await messagesAll
                .Skip(c)
                .ToListAsync();

            for (int i=0;i<messages.Count-shiftFromLast;i++)
            {
                mess.Add(new DirectMessageDTO(messages[i]));
            }
            return mess;

        }

        public async Task<List<GroupMessageDTO>> GetAllGroupMessages(int idSender, int idGroup)
        {
           List<GroupMessageDTO> mess=new List<GroupMessageDTO>();

            var messages=await _context.GroupMessages
                .Include(g=>g.Group)
                .Include(g=>g.Sender)
                .Where(g=>g.Group.Id==idGroup)
                .OrderBy(g => g.SendTime)
                .ToListAsync();

            foreach(var m in messages)
            {
                mess.Add(new GroupMessageDTO(m));
            }
            return mess;
        }

        public async Task<List<GroupMessageDTO>> GetAllGroupMessages(int idGroup)
        {
            List<GroupMessageDTO> mess = new List<GroupMessageDTO>();

            var messages = await _context.GroupMessages
                .Include(g => g.Group)
                .Include(g => g.Sender)
                .Where(g => g.Group.Id == idGroup)
                .OrderBy(g => g.SendTime)
                .ToListAsync();

            foreach (var m in messages)
            {
                mess.Add(new GroupMessageDTO(m));
            }
            return mess;
        }

        public async Task<List<GroupMessageDTO>> GetAllGroupMessagesFromTo(int idSender, int idGroup, int shiftFromLast, int number)
        {
            List<GroupMessageDTO> mess = new List<GroupMessageDTO>();

            var messagesAll = _context.GroupMessages
                .Include(g=>g.Group)
                .Include(g=>g.Sender)
                .Where(g => g.Group.Id == idGroup)
                .OrderBy(m => m.SendTime);

            int c = (messagesAll.Count() - shiftFromLast - number > 0) ? messagesAll.Count() - shiftFromLast - number : 0;
            var messages = await messagesAll
                .Skip(c)
                .ToListAsync();
            for (int i = 0; i < messages.Count - shiftFromLast; i++)
            {
                mess.Add(new GroupMessageDTO(messages[i]));
            }
            return mess;
        }

        public async Task<List<PollDTO>> GetAllGroupPolls(int idSender, int idGroup)
        {
            List<PollDTO> polls=new List<PollDTO>();  

            var pollFromGroup=await _context.Polls
                .Include(p=>p.MyGroup)
                .Where(p=>p.MyGroup.Id==idGroup&&(p.TimeOfCreate.AddMinutes(p.TimeToLive))>DateTime.Now)
                .OrderBy(p=>p.TimeOfCreate)
                .ToListAsync();

            foreach(var p in pollFromGroup) 
            {
                polls.Add(new PollDTO(p));
            }
            return polls;
        }

        public async Task<List<ChatDTO>> RetrunAllChatsInOrder(int userId)
        {
            var friendships1 = await _context.Friendships
                .Include(f => f.Friend)
                .Where(f => f.FriendshipOwner.Id == userId)
                .OrderByDescending(f=>f.LastMessage)
                .ToListAsync();

            var friendships2 = await _context.Friendships
                .Include(f => f.FriendshipOwner)
                .Where(f => f.Friend.Id == userId)
                .OrderByDescending(f => f.LastMessage)
                .ToListAsync();

            var groups = await _context.RegisteredUsers
                .Include(u => u.GroupMemeber)
                .Where(u => u.Id == userId)
                .Select(u => u.GroupMemeber)
                .FirstOrDefaultAsync();

            if (groups != null)
            {
                groups.Sort((g1, g2) =>(int) (g1.LastMessage - g2.LastMessage).TotalSeconds);
            }

            List<ChatDTO> chats=new List<ChatDTO>();

            int l1 = friendships1.Count;
            int l2=friendships2.Count;
            int l3 = groups == null ? -1 : groups.Count;
            int i = 0, j = 0, k = 0;
            int index = 0;
            while (i < l1 || j < l2 || k < l3)
            {
                DateTime a = DateTime.MinValue;
                DateTime b = DateTime.MinValue;
                DateTime c = DateTime.MinValue;

                if (i < l1)
                {
                    a = friendships1[i].LastMessage;
                }
                if (j < l2)
                {
                    b= friendships2[j].LastMessage;
                }
                if(k < l3)
                {
                    c = groups[k].LastMessage;
                }

                if (a >= b && a >= c)
                {
                    chats.Add(new ChatDTO(friendships1[i], index++, friendships1[i].Friend.Username, friendships1[i].Friend.ProfilePhoto,userId));
                    i++;
                }

                else if(b>=a && b >= c)
                {
                    chats.Add(new ChatDTO(friendships2[j], index++, friendships2[j].FriendshipOwner.Username, friendships2[j].FriendshipOwner.ProfilePhoto, userId));
                    j++;
                }
                else
                {
                    chats.Add(new ChatDTO(groups[k], index++, userId));
                    k++;
                }
                
            }

            return chats;
        }

        public async Task<PollDTO> VoteNo(int pollId)
        {
            var poll = await _context.Polls
                .Where(p => p.Id == pollId)
                .FirstOrDefaultAsync();
            if (poll == null) throw new Exception("Invalid Poll Id");

            poll.NumberoOfNo += 1;
            await _context.SaveChangesAsync();
            return new PollDTO(poll);
        }

        public async Task<PollDTO> VoteYes(int pollId)
        {
            var poll = await _context.Polls
                .Where(p => p.Id == pollId)
                .FirstOrDefaultAsync();
            if (poll == null) throw new Exception("Invalid Poll Id");

            poll.NumberOfYes += 1;
            await _context.SaveChangesAsync();
            return new PollDTO(poll);
        }
    }
}
