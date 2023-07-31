using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Logging;
using System.ComponentModel;
using System.Linq;

//Stojiljko
namespace MapMatchApi.Services.RequestService
{
    public class RequestService: IRequestService
    {
        public static readonly string FriendRequest = "Friend request";
        public static readonly string GroupInvite = "Group invite";
        public static readonly string Report = "Report";
        public static readonly string LocationShare = "Location share";
        public static string[] requestTypes = new string[] { "Friend request", "Group invite", "Report", "Location share" };
        //Friend request, group invite, report,location share , sluzi da se smeste moguce vrednosti za request i da se pri dodavanju proverava
        //da li je lepo zadat parametar (kao constraint, samo ce ga proveravamo na klasnoj strani)


        private readonly DataContext _context;


        public RequestService(DataContext context)
        {
            _context = context;
        }

        //vraca listu zahteva za datog usera
        public async Task<List<RequestView>> ReturnFriendRequests(int id)
        {
            try
            {


                var user = await _context.RegisteredUsers.Where(req => req.Id == id).FirstOrDefaultAsync();
                if (user == default)
                {
                    /*BadRequest badRequest = new BadRequest("User with selected id not found");
                    return badRequest;  //ovo sam nesto iz paranoje drndao manuelno*/

                    return null;
                }

                var requests = await _context.Requests
                                        .Include(entity => entity.Receiver)
                                        .Where(req => req.Receiver.Id == id && req.Type == RequestService.FriendRequest)
                                        .ToListAsync();

                List<RequestView> requestsReturn = new List<RequestView>();

                foreach (var request in requests)
                {
                    var item = new RequestView();
                    item.SenderUsername = request.Sender.Username;
                    item.ReceiverUsername = request.Receiver.Username;
                    item.SendTime = request.SendTime;
                    item.Type = request.Type;
                    item.RequestMessage = request.RequestMessage;
                    item.Active = request.Active;
                    item.SenderPhoto = request.Sender.ProfilePhoto;

                    requestsReturn.Add(item);
                }

                return requestsReturn;
            }
            catch (Exception ex)
            {    
                throw new Exception(ex.ToString());
            }
        }

        //Stojiljko, 1. metoda
        //ako je okej metoda, vraca null
        public async Task InsertFriendRequest(int idSender, int idReceiver)
        {
            
            var sender =  await _context.RegisteredUsers.Where(user => user.Id == idSender).FirstOrDefaultAsync();
            var receiver = await _context.RegisteredUsers.Where(user => user.Id == idReceiver).FirstOrDefaultAsync();
    

            if (sender == null || receiver == null)
            {
                throw new Exception("Sender or Receiver doesn't exist");
            }

            if (await this.CheckIfRequestExist(idSender, idReceiver, RequestService.FriendRequest))
            {
                throw new Exception("This request already exists");
            }

            Request request = new Request { Sender = sender, Receiver = receiver, SendTime = DateTime.Now
                                            , Type = RequestService.FriendRequest , Active = true, isSpam = false};

            try
            {
                
                await _context.Requests.AddAsync(request);
                await _context.SaveChangesAsync();
            }
            catch(Exception ex) { throw new Exception(ex.ToString()); }

        }

        public async Task InsertReport(int idSender, int idReported,string reason)
        {
            var sender = await _context.RegisteredUsers.Where(user => user.Id == idSender).FirstOrDefaultAsync();
            var reported = await _context.RegisteredUsers.Where(user => user.Id == idReported).FirstOrDefaultAsync();

            if (reported.IsAdmin)
            {
                throw new Exception("Admin cannot be reported");
            }

            if (sender == null || reported == null)
            {
                throw new Exception("Sender or Reported doesn't exist");
            }

            if (await this.CheckIfReportExists(idSender, idReported))
            {
                throw new Exception("This request already exists");
            }

            var admins = await _context.RegisteredUsers
                .Where(r => r.IsAdmin == true)
                .ToListAsync();
            Random rnd = new Random();
            int randomNum = rnd.Next(admins.Count);
            var admin = admins[randomNum];


            Request request = new Request
            {
                Sender = sender,
                RefersTo=reported,
                SendTime = DateTime.Now,
                InvitedToJoinGroup = null,
                Type = "Report",
                Active = true,
                isSpam = false,
                RequestMessage=reason,
                Receiver=admin
            };

            try
            {

                await _context.Requests.AddAsync(request);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex) { throw new Exception(ex.ToString()); }


        }

        public async Task InsertLocationShareRequest(int idSender, int idReceiver, int idRefersTo)
        {
            var refered = await _context.RegisteredUsers.Where(user => user.Id == idRefersTo).FirstOrDefaultAsync();
            var sender = await _context.RegisteredUsers.Where(user => user.Id == idSender).FirstOrDefaultAsync();
            var receiver = await _context.RegisteredUsers.Where(user => user.Id == idReceiver).FirstOrDefaultAsync();

            if (sender == null || receiver == null||refered==null)
            {
                throw new Exception("Invalid User Id");
            }

            if ((await this.CheckIfShareExists(idSender, idReceiver,idRefersTo, RequestService.LocationShare)) == true)
            {
                throw new Exception("This request already exists");
            }

            string type = "Location share";
         

            Request request = new Request
            {
                Sender = sender,
                Receiver = receiver,
                RefersTo=refered,
                SendTime = DateTime.Now
                                            ,
                Type = type,
                Active = true,
                isSpam = false
            };

            try
            {

                await _context.Requests.AddAsync(request);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex) { throw new Exception(ex.ToString()); }

        }
        public async Task InsertGroupInviteRequest(int idSender, int idReceiver, int idGroup)
        {
            var sender = await _context.RegisteredUsers.Where(user => user.Id == idSender).FirstOrDefaultAsync();
            var receiver = await _context.RegisteredUsers.Where(user => user.Id == idReceiver).FirstOrDefaultAsync();
            var group = await _context.Groups.Where(group => group.Id == idGroup).FirstOrDefaultAsync();

            if (group == null)
            {
                throw new Exception("Group doesn't exist");
            }

            if (sender == null || receiver == null)
            {
                throw new Exception("Sender or Receiver doesn't exist");
            }

            if ((await this.CheckIfGroupInviteExists(idSender, idReceiver, idGroup)) == true)
            {
                throw new Exception("This request already exists");
            }

            string type = "Group invite";


            Request request = new Request
            {
                Sender = sender,
                Receiver = receiver,
                SendTime = DateTime.Now
                                            ,
                Type = type,
                Active = true,
                isSpam = false,
                InvitedToJoinGroup = group
            };

            try
            {
                await _context.Requests.AddAsync(request);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex) { throw new Exception(ex.ToString()); }

        }

        public async Task<Request> GetFriendRequestByID(int id)
        {
            var request = await _context.Requests.Where(req => req.Id == id).FirstOrDefaultAsync();

            return request;
        }

        //Stojiljko
        //2. metoda
        public async Task DeleteFriendRequest(int idSender, int idReceiver)
        {
            if (idSender == idReceiver)
            {
                throw new Exception("Sender and receiver are the same ones");
            }
            var request = await _context.Requests
                                .Include(req => req.Sender).Include(req => req.Receiver)
                                .Where(req => req.Sender.Id == idSender && req.Receiver.Id == idReceiver
                                && req.Type == RequestService.FriendRequest)
                                .FirstOrDefaultAsync();

            if (request == null)
            {
                throw new Exception("Request doesn't exist");
            }
            try
            {
                _context.Requests.Remove(request);
                await _context.SaveChangesAsync();

            }
            catch(Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task DeleteLocationShareRequest(int idSender, int idReceiver,int idRefer)
        {
            if (idSender == idReceiver)
            {
                throw new Exception("Sender and receiver are the same ones");
            }
            var request = await _context.Requests
                                .Include(req => req.Sender).Include(req => req.Receiver).Include(req=>req.RefersTo)
                                .Where(req => req.Sender.Id == idSender && req.Receiver.Id == idReceiver&&req.RefersTo!=null&&req.RefersTo.Id==idRefer
                                && req.Type == RequestService.LocationShare)
                                .FirstOrDefaultAsync();

            if (request == null)
            {
                throw new Exception("Request doesn't exist");
            }
            try
            {
                _context.Requests.Remove(request);
                await _context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task DeleteReport(int idSender, int idReceiver)
        {
         
            var request = await _context.Requests
                                .Include(req => req.Sender).Include(req => req.Receiver)
                                .Where(req => req.Sender.Id == idSender && req.Receiver.Id == idReceiver
                                && req.Type == RequestService.Report)
                                .FirstOrDefaultAsync();

            if (request == null)
            {
                throw new Exception("Request doesn't exist");
            }
            try
            {
                _context.Requests.Remove(request);
                await _context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }
        public async Task DeleteGroupInviteRequest(int idSender, int idReceiver)
        {
            if (idSender == idReceiver)
            {
                throw new Exception("Sender and receiver are the same ones");
            }
            var request = await _context.Requests
                                .Include(req => req.Sender).Include(req => req.Receiver)
                                .Where(req => req.Sender.Id == idSender && req.Receiver.Id == idReceiver
                                && req.Type == RequestService.GroupInvite)
                                .FirstOrDefaultAsync();

            if (request == null)
            {
                throw new Exception("Request doesn't exist");
            }
            try
            {
                _context.Requests.Remove(request);
                await _context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task DeleteRequest(int id)
        {
            try
            {
                _context.Remove(await _context.Requests.FindAsync(id));
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<Request> GetFriendRequestByUsername(string userUsername, string senderUsername)
        {
            if (userUsername == senderUsername)
            {
                throw new Exception("Sender and receiver are the same ones");
            }
            var request = await _context.Requests.Include(table => table.Sender)
                                        .Include(table => table.Receiver)
                                        .Where(req => req.Sender.Username == senderUsername
                                        && req.Receiver.Username == userUsername && req.Type == RequestService.FriendRequest)
                                        .FirstOrDefaultAsync();
            
        
            if (request == null)
            {
                throw new Exception("There isn't sender who sent a request to specified receiver");
            }
            return request;
        }


        //public async Task<List<Request>> ListFriendRequestsForUser(int idUser)
        //{
        //    var requests = await _context.Requests.Include(table => table.Receiver)
        //                            .Where(req => req.Receiver.Id == idUser && req.Type == "Friend request")
        //                            .ToListAsync();

        //    if (requests.Result.Any() == false) { throw new Exception("There is not any friend request"); }
        //    else { return requests; }
        //}   //ovu metodu oooobavezno ponovo pogledati (kao i sve ostale naravno, jer jos nisam napravio migraciju)



        public async Task<List<RequestView>> ListFriendRequestsForUser(int idUser)
        {
            try
            {
                var requests = await _context.Requests
                                .Include(request => request.Sender)
                                .Include(request => request.Receiver)
                                .Include(request => request.InvitedToJoinGroup)
                                .Where(request => request.Receiver.Id == idUser && request.Type == RequestService.FriendRequest)
                                .ToListAsync();
                if (requests == null)
                {
                    throw new Exception("Problem with connection with database");
                }

                List<RequestView> requestsReturn = new List<RequestView>();

                foreach (var request in requests)
                {
                    var item = new RequestView();
                    item.SenderUsername = request.Sender.Username;
                    item.ReceiverUsername = request.Receiver.Username;
                    item.SendTime = request.SendTime;
                    item.Type = request.Type;
                    item.RequestMessage = request.RequestMessage;
                    item.Active = request.Active;
                    item.SenderPhoto = request.Sender.ProfilePhoto;
                    item.ReferedGroup = request.InvitedToJoinGroup;

                    requestsReturn.Add(item);
                }

                return requestsReturn;
            }
            catch (Exception ex)
            {
                throw new Exception("There is not any request");
            }
        }
        public async Task<List<RequestView>> ListRequestsForUser(int idUser)
        {
            List<Request> requests;
            try
            {
                requests = await _context.Requests
                                .Include(request => request.Receiver)
                                .Include(request => request.Sender)
                                .Include(request => request.InvitedToJoinGroup)
                                .Where(request => request.Receiver.Id == idUser)
                                .ToListAsync();

                List<RequestView> requestsReturn = new List<RequestView>();

                foreach (var request in requests)
                {
                    var item = new RequestView();
                    item.SenderUsername = request.Sender.Username;
                    item.ReceiverUsername = request.Receiver.Username;
                    item.SendTime = request.SendTime;
                    item.Type = request.Type;
                    item.RequestMessage = request.RequestMessage;
                    item.Active = request.Active;
                    item.SenderPhoto = request.Sender.ProfilePhoto;
                    item.ReferedGroup = request.InvitedToJoinGroup;

                    requestsReturn.Add(item);
                }

                return requestsReturn;
            }
            catch (Exception ex)
            {
                throw new Exception("There is not any request");
            }


        }
        public async Task<bool> CheckIfShareExists(int idSender, int idReceiver, int idRefered,string type)
        {
            if (idSender == idRefered) throw new Exception("Can't ask for himself");
            if (idSender == idReceiver) throw new Exception("Can't ask himself");
            if (idReceiver == idRefered) throw new Exception("Can't share to himself");

            bool flag = await _context.Requests
                .Include(r => r.Receiver)
                .Include(r => r.Sender)
                .Include(r => r.RefersTo)
                .Where(r => r.Sender.Id == idSender && r.Receiver.Id == idReceiver &&r.RefersTo!=null&& r.RefersTo.Id == idRefered&&r.Type==type)
                .AnyAsync();

            return flag;
        }
        public async Task<bool> CheckIfRequestExist(int idSender, int idReceiver, string type)
        {
            if (idSender == idReceiver)
            {
                throw new Exception("Sender and receiver are the same ones");
            }
            bool flag = await _context.Requests
                            .Include(request => request.Receiver)
                            .Include(request => request.Sender)
                            .Where(request => request.Sender.Id == idSender && request.Receiver.Id == idReceiver
                            && request.Type == type)
                            .AnyAsync();
            return flag;
        }
        public async Task<bool> CheckIfReportExist(int idSender, int idReported, string type)
        {
            if (idSender == idReported)
            {
                throw new Exception("Sender and Reported are same");
            }
            bool flag = await _context.Requests
                            .Include(request => request.RefersTo)
                            .Include(request => request.Sender)
                            .Where(request => request.Sender.Id == idSender && request.RefersTo.Id == idReported
                            && request.Type == type)
                            .AnyAsync();
            return flag;
        }


        //jer ima ovo Result.Any()

        public async Task RejectFriendRequest(int idSender, int idReceiver)
        {
            try
            {
                var request = await _context.Requests
                                .Include(request => request.Receiver)
                                .Include(request => request.Sender)
                                .Where(request => request.Sender.Id == idSender && request.Receiver.Id == idReceiver
                                 && request.Type == RequestService.FriendRequest)
                                .FirstOrDefaultAsync();
                
                if (request == null)
                {
                    throw new Exception("There isn't request with these id's");
                }

                request.Active = false;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex) 
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<List<RequestView>> ListAllRequestsExceptReports(int idUser)
        {
            try
            {
                var requests = await _context.Requests
                                        .Include(request => request.Sender)
                                        .Include(request => request.Receiver)
                                        .Include(request=>request.RefersTo)
                                        .Include(request => request.InvitedToJoinGroup)
                                        .Where(request => (request.Type == RequestService.FriendRequest
                                        && request.Receiver.Id == idUser && request.Active == true)
                                        || (request.Type == RequestService.LocationShare
                                        && request.Receiver.Id == idUser) ||
                                        (request.Type == RequestService.GroupInvite
                                        && request.Receiver.Id == idUser))
                                        .ToListAsync(); 

                List<RequestView> requestsReturn = new List<RequestView>();

                foreach(var request in requests) 
                {
                    var item = new RequestView();
                    item.SenderUsername = request.Sender.Username;
                    item.ReceiverUsername = request.Receiver.Username;
                    item.SenderPhoto = request.Sender.ProfilePhoto;
                    item.SendTime = request.SendTime;
                    item.Type = request.Type;
                    item.Active = request.Active;
                    if(request.Type == RequestService.GroupInvite)
                    {
                        item.ReferedGroup = request.InvitedToJoinGroup;
                    }
                    if (request.Type == RequestService.LocationShare)
                    {
                        item.RefersToUsername = request.RefersTo.Username;
                    }

 
                    requestsReturn.Add(item);
                }

                return requestsReturn;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }

        }

        public async Task DeleteRequest(Request request)
        {
            try
            {
                _context.Remove(request);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task CleanAllOldFriendRequests(int idUser)
        {
            try
            {
                var requests = await _context.Requests
                            .Include(request => request.Sender)
                            .Include(request => request.Receiver)
                            .Where(request => (request.Sender.Id == idUser || request.Receiver.Id == idUser)
                            && request.Active == false && request.Type == RequestService.FriendRequest)
                            .ToListAsync();

                foreach (var request in requests)
                {
                    TimeSpan span = DateTime.Now - request.SendTime;
                    if (span.CompareTo(new TimeSpan(0, 0, 10, 0)) > 0)
                    {
                        await this.DeleteRequest(request);
                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<bool> CheckIfGroupInviteExists(int idSender, int idReceiver, int idGroup)
        {
            try
            {
                if (idSender == idReceiver)
                {
                    throw new Exception("Sender and receiver are the same ones");
                }
                bool flag = await _context.Requests
                                .Include(request => request.Receiver)
                                .Include(request => request.Sender)
                                .Include(request => request.InvitedToJoinGroup)
                                .Where(request => request.Type == RequestService.GroupInvite)
                                .Where(request => request.Sender.Id == idSender && request.Receiver.Id == idReceiver
                                && request.InvitedToJoinGroup.Id == idGroup)
                                .AnyAsync();
                return flag;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<bool> CheckIfReportExists(int idSender, int idReceiver)
        {
            try
            {
                if (idSender == idReceiver)
                {
                    throw new Exception("Sender and receiver are the same ones");
                }
                bool flag = await _context.Requests
                                .Include(request => request.Receiver)
                                .Include(request => request.Sender)
                                .Where(request => request.Type == RequestService.Report)
                                .Where(request => request.Sender.Id == idSender && request.Receiver.Id == idReceiver)
                                .AnyAsync();
                return flag;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<List<RequestView>> ListAllReportsReferedToAdmin(int idAdmin)
        {
            try
            {
                var reports = await _context.Requests
                                .Include(request => request.Sender)
                                .Include(request => request.Receiver)
                                .Include(request => request.RefersTo)
                                .Where(request => request.Type == RequestService.Report)
                                .Where(request => request.Receiver.Id == idAdmin)
                                .ToListAsync();

                List <RequestView>  reportsReturn= new List<RequestView>();

                foreach (var request in reports)
                {
                    var item = new RequestView
                    {
                        SenderUsername = request.Sender.Username,
                        ReceiverUsername = request.Receiver.Username,
                        SendTime = request.SendTime,
                        Type = request.Type,
                        RequestMessage = request.RequestMessage,
                        Active = request.Active,
                        SenderPhoto = request.Sender.ProfilePhoto,
                        RefersToId = request.RefersTo.Id,
                        RefersToUsername = request.RefersTo.Username,
                        ReportMessage = request.RequestMessage
                    };

                    reportsReturn.Add(item);

                }

                return reportsReturn;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<bool> RejectedFriendRequestExists(int idUser1, int idUser2)
        {
            try
            {
                bool flag = await _context.Requests
                               .Include(request => request.Sender)
                               .Include(request => request.Receiver)
                               .Where(request => ((request.Sender.Id == idUser1 && request.Receiver.Id == idUser2)
                               || (request.Sender.Id == idUser2 && request.Receiver.Id == idUser1)) && request.Active == false)
                               .AnyAsync();

                return flag;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task CleanAllReports()
        {
            try
            {
                var users = await _context.RegisteredUsers
                            .Where(user => user.SuspendedTill != null)
                            .ToListAsync();

                foreach(var user in users)
                {
                    if (user.SuspendedTill < DateTime.Now)
                    {
                        user.SuspendedTill = null;
                    }
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<List<RegisteredUser>> GetAllUsersReadyForCleaning()
        {
            try
            {
                var users = await _context.RegisteredUsers
                            .Where(user => user.SuspendedTill != null)
                            .ToListAsync();

                List<RegisteredUser> usersReturn = new List<RegisteredUser>();
                foreach(var user in users)
                {
                    if (user.SuspendedTill < DateTime.Now)
                    {
                        usersReturn.Add(user);
                    }
                }


                return users;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

    }

   
}
