using MapMatchApi.Services.RegisteredUserService;
using MapMatchApi.Services.RequestService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace MapMatchApi.Controllers
{

    public class RequestController : ControllerBase
    {
       

        private readonly Services.RequestService.IRequestService _requestService;
        private readonly Services.RegisteredUserService.IRegisteredUserService _registeredUserService;
        public RequestController(Services.RequestService.IRequestService requestService, 
                                 Services.RegisteredUserService.IRegisteredUserService registeredUserService)
        {
            _requestService = requestService;
            _registeredUserService = registeredUserService;
        }

        //vraca listu zahteva za datog usera
        [HttpGet("api/[controller]/ReturnFriendRequests/{id}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> ReturnFriendRequests(int id)
        {
            var requests = await _requestService.ListFriendRequestsForUser(id);

            List<RequestView> requestsReturn = new List<RequestView>();
            foreach(var request in requests) 
            {
                var req = new RequestView();
                req.Active = request.Active;
                req.SenderUsername = request.SenderUsername;
                req.ReceiverUsername = request.ReceiverUsername;
                req.SendTime = request.SendTime;
                req.Type = request.Type;
                req.RequestMessage = request.RequestMessage;

                requestsReturn.Add(req);
            }

            if (requests == null) { return BadRequest("User id not found");  }
            return Ok(requests);
        }

        [HttpGet("api/[controller]/ReturnRequestsByID/{id}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> ReturnRequestsByID(int id)
        {
            try
            {
                var requests = await _requestService.ListRequestsForUser(id);
                if (requests == null) { return BadRequest("User id not found"); }
                return Ok(requests);
            }
           catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("api/[controller]/ListAllRequestsExceptReportsForUserById/{idUser}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> ListAllRequestsExceptReportsByIdUser(int idUser)
        {
            try
            {
                var requests = await _requestService.ListAllRequestsExceptReports(idUser);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("api/[controller]/ListAllReportsReferedToAdmin/{idAdmin}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> ListAllReportsReferedToAdmin(int idAdmin)
        {
            try
            {
                bool isAdmin = await _registeredUserService.IsAdmin(idAdmin);
                if (!isAdmin)
                {
                    return BadRequest("He is not admin");
                }
                var requests = await _requestService.ListAllReportsReferedToAdmin(idAdmin);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("api/[controller]/CheckIfGroupInviteExists/{idSender}/{idReceiver}/{idGroup}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> CheckIfGroupInviteExists(int idSender, int idReceiver, int idGroup)
        {
            try
            {
                var requests = await _requestService.CheckIfGroupInviteExists(idSender, idReceiver, idGroup);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("api/[controller]/CheckIfFriendRequestExists/{idSender}/{idReceiver}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> CheckIfFriendRequestExists(int idSender, int idReceiver)
        {
            try
            {
                var requests = await _requestService.CheckIfRequestExist(idSender, idReceiver, RequestService.FriendRequest);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("api/[controller]/RejectedFriendRequestExists/{idUser1}/{idUser2}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> RejectedFriendRequestExists(int idUser1, int idUser2)
        {
            try
            {
                var requests = await _requestService.RejectedFriendRequestExists(idUser1, idUser2);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpPost("api/[controller]/InsertFriendRequestByIDs/{idSender}/{idReceiver}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> InsertFriendRequestByIDs(int idSender, int idReceiver)
        {
            try
            {
                await _requestService.InsertFriendRequest(idSender, idReceiver);
            }
            catch (Exception ex) { return BadRequest(ex.ToString()); }

            return Ok("Friend request inserted successfully");
        }

        [HttpPost("api/[controller]/InsertGroupInviteByIDs/{idSender}/{idReceiver}/{idGroup}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> InsertGroupInviteByIDs(int idSender, int idReceiver, int idGroup)
        {
            try
            {
                await _requestService.InsertGroupInviteRequest(idSender, idReceiver, idGroup);
            }
            catch (Exception ex) { return BadRequest(ex.ToString()); }

            return Ok("Friend request inserted successfully");
        }

        [HttpPost("api/[controller]/InsertLocationShareRequestByIDs/{idSender}/{idReceiver}/{idRefersTo}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> InsertLocationShareRequestByIDs(int idSender, int idReceiver,int idRefersTo)
        {
            try
            {
                await _requestService.InsertLocationShareRequest(idSender, idReceiver,idRefersTo);
            }
            catch (Exception ex) { return BadRequest("Request already exists"); }

            return Ok("Location share request inserted successfully");
        }

        [HttpPost("api/[controller]/InsertReportByIDs/{idSender}/{idReported}/{reason}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> InsertReportByIDs(int idSender, int idReported,string reason)
        {
            try
            {
                await _requestService.InsertReport(idSender, idReported,reason);
            }
            catch (Exception ex) { return BadRequest("Request already exists"); }

            return Ok("Report inserted successfully");
        }

        //Stojiljko, 2. metoda
        [HttpDelete("api/[controller]/DeleteRequest/{idRequest}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteRequest(int idRequest)
        {
            try
            {
                await _requestService.DeleteRequest(idRequest);
            }
            catch (Exception ex) { return BadRequest(ex.ToString()); }

            return Ok("Request deleted");
        }




        //[HttpPost]
        //[Route("api/[controller]/AcceptFriendRequest/{Username}")]
        //public async Task<ActionResult> AcceptFriendRequest(string username)
        //{
        //    var request = _requestService
        //}


        [HttpDelete("api/[controller]/DeleteFriendRequest/{usernameProfile}/{usernameSender}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteFriendRequest(string usernameProfile, string usernameSender)
        {
            try
            {
                int idSender = await _registeredUserService.GetUserIdByUsername(usernameSender);
                int idReceiver = await _registeredUserService.GetUserIdByUsername(usernameProfile);
                await _requestService.DeleteFriendRequest(idSender, idReceiver);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Friend request deleted successfully");
        }

        [HttpDelete("api/[controller]/DeleteFriendRequestByIDs/{idSender}/{idReceiver}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteFriendRequestByIds(int idSender, int idReceiver)
        {
            try
            {
                await _requestService.DeleteFriendRequest(idSender, idReceiver);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Friend request deleted successfully");
        }

        [HttpDelete("api/[controller]/DeleteLocationShareRequest/{usernameSender}/{usernameProfile}/{referedUsername}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteLocationShareRequest( string usernameSender, string usernameProfile, string referedUsername)
        {
            try
            {
                int idReceiver = await _registeredUserService.GetUserIdByUsername(usernameProfile);
                int idSender = await _registeredUserService.GetUserIdByUsername(usernameSender);
                int idRefer = await _registeredUserService.GetUserIdByUsername(referedUsername);
                await _requestService.DeleteLocationShareRequest(idSender, idReceiver,idRefer);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Location share request deleted successfully");
        }

        [HttpDelete("api/[controller]/DeleteLocationShareRequestByID/{idSender}/{idReceiver}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteLocationShareRequestById(int idSender, int idReceiver)
        {
            try
            {
                return BadRequest("not implemented");
                //await _requestService.DeleteLocationShareRequest(idSender, idReceiver);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Location share request deleted successfully");
        }

        [HttpDelete("api/[controller]/DeleteReport/{usernameProfile}/{usernameSender}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteReport(string usernameProfile, string usernameSender)
        {
            try
            {
                int idReceiver = await _registeredUserService.GetUserIdByUsername(usernameProfile);
                int idSender = await _registeredUserService.GetUserIdByUsername(usernameSender);
                await _requestService.DeleteReport(idSender, idReceiver);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Report deleted successfully");
        }

        [HttpDelete("api/[controller]/DeleteReportByID/{idSender}/{idReceiver}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteReportById(int idSender, int idReceiver)
        {
            try
            {
                await _requestService.DeleteReport(idSender, idReceiver);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Report deleted successfully");
        }

        [HttpDelete("api/[controller]/DeleteGroupInviteRequest/{usernameProfile}/{usernameSender}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteGroupInviteRequest(string usernameProfile, string usernameSender)
        {
            try
            {
                int idReceiver = await _registeredUserService.GetUserIdByUsername(usernameProfile);
                int idSender = await _registeredUserService.GetUserIdByUsername(usernameSender);

                await _requestService.DeleteGroupInviteRequest(idSender, idReceiver);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Group invite deleted successfully");
        }

        [HttpDelete("api/[controller]/DeleteGroupInviteRequestByID/{idSender}/{idReceiver}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteGroupInviteRequestById(int idSender, int idReceiver)
        {
            try
            {
                await _requestService.DeleteGroupInviteRequest(idSender, idReceiver);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Group invite request deleted successfully");
        }

        [HttpDelete("api/[controller]/CleanAllOldFriendRequests/{idUser}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteGroupInviteRequestById(int idUser)
        {
            try
            {
                await _requestService.CleanAllOldFriendRequests(idUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Group invite deleted sucessfully");
        }

        [HttpPut("api/[controller]/RejectFriendRequest/{idSender}/{idReceiver}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> RejectFriendRequest(int idSender, int idReceiver)
        {
            try
            {
                await _requestService.RejectFriendRequest(idSender, idReceiver);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

            return Ok("Friend request rejected successfully");
        }

        [HttpGet("api/[controller]/CheckIfShareExists/{idSender}/{idReceiver}/{idRefered}/{type}"),Authorize(Roles="user,admin")]
        public async Task<ActionResult> CheckIfShareExists(int idSender, int idReceiver,int idRefered, string type)
        {
            try
            {
                var result = await _requestService.CheckIfShareExists(idSender, idReceiver, idRefered, type);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("api/[controller]/CleanAllReports"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> CleanAllReports()
        {
            try
            {
                await _requestService.CleanAllReports();

                return Ok("Reports are cleaned");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

        }

        [HttpGet("GetAllUsersReadyForReportCleaning"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllUsersReadyForReportCleaning()
        {
            var users = await _requestService.GetAllUsersReadyForCleaning();
            return Ok(users);
        }
    }
}