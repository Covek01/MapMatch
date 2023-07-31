using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography;

namespace MapMatchApi.Services.RequestService
{
    public interface IRequestService
    {
        Task<List<RequestView>> ReturnFriendRequests(int id);
        //get methods
        Task<Request> GetFriendRequestByID(int id);  //vraca request po id requesta
        Task<List<RequestView>> ListFriendRequestsForUser(int idUser);  //lista niz zahteva za prijateljstvo za usera
        Task<List<RequestView>> ListRequestsForUser(int idUser);         //vraca niz zahteva za usera
        Task<Request> GetFriendRequestByUsername(string userUsername, string senderUsername);
            //metoda koja vraca zahtev za prijateljstvo poslat od strane sender ka user-u,
            //potreban za brisanje request-a
        Task<List<RequestView>> ListAllRequestsExceptReports(int idUser);
        Task CleanAllOldFriendRequests(int idUser);
        Task<List<RequestView>> ListAllReportsReferedToAdmin(int idAdmin);
        Task CleanAllReports();
        Task<List<RegisteredUser>> GetAllUsersReadyForCleaning();
        


        //insert methods
        //public void InsertFriendRequest(int idSender, int idReceiver);
        Task InsertFriendRequest(int idSender, int idReceiver);
        Task InsertLocationShareRequest(int idSender, int idReceiver,int idRefersTo);
        Task InsertReport(int idSender, int idReported, string reason);
        Task InsertGroupInviteRequest(int idSender, int idReceiver,int idGroup);


        Task RejectFriendRequest(int idSender, int idReceiver);
        ////delete methods
        Task DeleteFriendRequest(int idSender, int idReciever);
        Task DeleteLocationShareRequest(int idSender, int idReciever,int idRefer);
        Task DeleteReport(int idSender, int idReciever);
        Task DeleteGroupInviteRequest(int idSender, int idReciever);
        Task DeleteRequest(int id);
        Task DeleteRequest(Request request);
        Task<bool> CheckIfRequestExist(int idSender, int idReceiver, string type);
        Task<bool> CheckIfGroupInviteExists(int idSender, int idReceiver, int idGroup);
        Task<bool> CheckIfReportExists(int idSender, int idReported);
        Task<bool> CheckIfShareExists(int idSender, int idReceiver, int idRefered, string type);
        Task<bool> RejectedFriendRequestExists(int idSender, int idReceiver);

    }
}
