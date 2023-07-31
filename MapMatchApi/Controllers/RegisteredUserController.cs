using MapMatchApi.Services.RegisteredUserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MapMatchApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisteredUserController : ControllerBase
    {
        private readonly IRegisteredUserService _registeredUserService;


        public RegisteredUserController(IRegisteredUserService registeredUserService)
        {
            _registeredUserService = registeredUserService;
        }

        //stojiljko
        //[HttpGet]
        //[Route("api/[controller]/ReturnFriends/{id}")]
        //public async Task<ActionResult> ReturnFriendsQuery(int id)

        //{
        //    var friendList = _registeredUserService.ReturnFriends(id);
        //    if (friendList== null) { return BadRequest("There isn't an user with specified id"); }

        //    return Ok(friendList);
        //}



        //  [HttpPost]
        //public async Task<ActionResult> Registration([FromBody] RegistrationUser user)

        //{
        //    var friendList = _registeredUserService.ReturnFriends(id);
        //    if (friendList== null) { return BadRequest("There isn't an user with specified id"); }

        //    return Ok(friendList);
        //}

        [HttpGet("GetIdFromUsername"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> GetIdFromUsername(string username)
        {
            try
            {
                var result = await _registeredUserService.GetUserIdByUsername(username);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("ExtendToken"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> ExtendToken()
        {
            try
            {
                var result = _registeredUserService.ExtendToken();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetMyInfo"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> GetMyInfo()
        {
            try
            {
                var value = await _registeredUserService.GetMyInfo();
                return Ok(value);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Register")]
        public async Task<ActionResult> Registration([FromBody] RegistrationUser user)
        {
            try
            {
                var result = await _registeredUserService.Registration(user);
                if (result != null)
                    return Ok(result);

                return BadRequest("Service fail");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            finally
            {

            }

        }



        [HttpGet("VerifyMail")]
        public async Task<ActionResult> VerifyAccoount([FromQuery] string email, [FromQuery] string code)
        {
            try
            {
                var user = await _registeredUserService.VerifyUser(email, code);
                return Ok("Uspesno verifikovan mail");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            finally
            {

            }

        }

        [HttpPost("Login")]
        public async Task<ActionResult> LogIn([FromBody] LogInUser user)
        {
            try
            {
                var userWithToken = await _registeredUserService.LogIn(user);
                if (userWithToken != null)
                    return Ok(userWithToken);

                return BadRequest("Service fail");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
            finally
            {

            }
        }

        [HttpDelete("DeleteUser")]
        public async Task<ActionResult> DeleteUser(int userdId)
        {
            try
            {
                var deletedUser = await _registeredUserService.DeleteUserById(userdId);
                return Ok(deletedUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            finally
            {

            }
        }

        [HttpPut("SuspendUser"), Authorize(Roles = "admin")]
        public async Task<ActionResult> SuspendUser(int userId, int numOfHours)
        {
            try
            {
                var result = await _registeredUserService.SuspendUserById(userId, numOfHours);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _registeredUserService.GetAllUsers();
            return Ok(users);


        }




        [HttpPut("SetStatus/{status}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> SetStatus(string status)
        {
            try
            {
                await _registeredUserService.SetStatus(status);
                return Ok("status changed");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetStatus/{id}"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> GetStatus(int id)
        {
            try
            {
                var result = await _registeredUserService.GetStatus(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetId"), Authorize(Roles = "admin,user")]
        public ActionResult GetId()
        {
            try
            {
                return Ok(_registeredUserService.GetMyId());

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetSharedUsers/{id}"),Authorize(Roles ="admin,user")]
        public async Task<ActionResult> GetSharedUsers(int id)
        {
            try
            {
                var result = await _registeredUserService.GetSharedUsers(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("ShareLocation/{fromUsername}/{toUsername}"),Authorize(Roles ="admin,user")]
        public async Task<ActionResult> ShareLocation(string fromUsername,string toUsername)
        {
            try
            {
                await _registeredUserService.ShareLocation(fromUsername, toUsername);
                return Ok("shared");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("UserCanSeeUser/{idUser}/{username}"),Authorize(Roles ="admin,user")]
        public async Task<ActionResult> UserCanSeeUser(int idUser, string username)
        {
            try
            {
                var result =await _registeredUserService.UserCanSeeUser(idUser, username);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetUsername"), Authorize(Roles = "admin,user")]
        public ActionResult GetUsername()
        {
            try
            {

            return Ok(_registeredUserService.GetMyUsername());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetRole"), Authorize(Roles = "admin,user")]
        public ActionResult GetRole()
        {
            try
            {
            return Ok(_registeredUserService.GetMyRoles());

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }

       


        [HttpGet("FindUserByUsername"), Authorize(Roles = "admin,user")]
        public async Task<ActionResult> FindUserByUsername(string username)
        {
            try
            {
                return Ok(await _registeredUserService.FindUserByUsername(username));

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }



        [HttpGet("GetIsVisibleValue"), Authorize(Roles = "admin,user")]
        public async Task<ActionResult> GetIsVisivleValue(int id)
        {
            try
            {
                return Ok(await _registeredUserService.GetIsVisibleValue(id));
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpPut("ChangeIsVisible"), Authorize(Roles = "admin,user")]
        public async Task<ActionResult> ChangeIsVisible(int id)
        {
            try
            {
                return Ok(await _registeredUserService.ChangeIsVisible(id));
            }
            catch (Exception e)
            {

                return BadRequest(e);
            }

        }

        [HttpPut("SetIsVisible/{userId}"),Authorize(Roles ="admin,user")]
        public async Task<ActionResult> SetIsVisible(int userId,bool visible)
        {
            try
            {
                await _registeredUserService.SetIsVisible(userId, visible);
                return Ok(visible);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetAllNearUsers"), Authorize(Roles = "admin,user")]
        public async Task<ActionResult> GetAllNearUsers(int id)
        {
            try
            {
                return Ok(await _registeredUserService.GetAllNearUsers(id));
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }


        [HttpGet("GetMyLocation"), Authorize(Roles = "admin,user")]
        public async Task<ActionResult> GetMyLocation()
        {
            return BadRequest("Not Implemented");


        }
        [HttpPut("SetMyLocation"), Authorize(Roles = "admin,user")]
        public async Task<ActionResult> SetMyLocation(double longitude, double latitude)
        {
            return BadRequest("Not implemented");
        }
        [HttpGet("GetLocation")]
        public async Task<ActionResult> GetLocation(int id)
        {
            try
            {
                return Ok(await _registeredUserService.GetLocation(id));

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("SetLocation")]
        public async Task<ActionResult> SetLocation(int id, double longitude, double latitude)
        {
            try
            {
                return Ok(await _registeredUserService.SetLocation(id, longitude, latitude));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("GetProfilePhoto"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetProfilePhoto(int id)
        {
            try
            {
                return Ok(await _registeredUserService.GetProfilePhoto(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("SetProfilePhoto"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> SetProfilePhoto(int id, string photo)
        {
            try
            {
                return Ok(await _registeredUserService.SetProfilePhoto(id, photo));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetFriendLocationByUsername"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetFriendLocationByUsername(int id, string username)
        {
            try
            {
                return Ok(await _registeredUserService.GetFriendLocationByUsername(id, username));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("GetAllFriendsLocation"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllFriendsLocation(int id)
        {
            try
            {
                return Ok(await _registeredUserService.GetAllFriendsLocation(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetAllGroupMembersLocation"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllGroupMembersLocation(int groupId)
        {
            try
            {
                return Ok(await _registeredUserService.GetAllGroupMembersLocations(groupId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetLocationsFromAllGroups"), Authorize(Roles = "user,admin")]

        public async Task<ActionResult> GetLocationFromAllGroups(int id)
        {
            try
            {
                return Ok(await _registeredUserService.GetLocationsFromAllGroups(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetGroupVisibility/{groupId}/{userId}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetGroupVisibility(int groupId, int userId)
        {
            try
            {
                var result = await _registeredUserService.GetGroupVisibility(userId, groupId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("ChangeGroupVisibility/{groupId}/{userId}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> ChangeGroupVisibility(int groupId, int userId)
        {
            try
            {
                var result = await _registeredUserService.ChangeGroupVisibility(userId, groupId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("MailAvaiable/{email}")]
        public ActionResult MailAvaiable(string email)
        {
            try
            {
                var result = _registeredUserService.MailAvaiable(email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetUserIdByUsername/{username}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetUserIdByUsername(string username)
        {
            int id;
            try
            {
                id = await _registeredUserService.GetUserIdByUsername(username);
                return Ok(id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("ReturnPicture"),Authorize(Roles ="user,admin")]
        public ActionResult ReturnPicture([FromBody] string path)
        {
            try
            {
                var result = _registeredUserService.ReturnPicture(path);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetFullName/{idUser}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetFullName(int idUser)
        {
            try
            {
                string fullName = await _registeredUserService.GetFullName(idUser);
                return Ok(fullName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetIdByUsername/{username}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetIdByUsername(string username)
        {
            try
            {
                int id = await _registeredUserService.GetIdByUsername(username);
                return Ok(id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("IsAdmin/{idUser}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> IsAdmin(int idUser)
        {
            try
            {
                bool flag = await _registeredUserService.IsAdmin(idUser);
                return Ok(flag);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("CheckIsUserBanned/{idUser}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> CheckIsUserBanned(int idUser)
        {
            try
            {
                bool flag = await _registeredUserService.CheckIsUserBanned(idUser);
                return Ok(flag);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("BanUser/{idUser}/{numOfDays}/{numOfHours}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> BanUser(int idUser, int numOfDays, int numOfHours)
        {
            try
            {
                await _registeredUserService.BanUser(idUser, numOfDays, numOfHours);
                return Ok("User successfully banned");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        



        //[HttpGet("nearusers")]
        //public async Task<ActionResult> GetAll


        //[HttpGet]
        //public async Task<ActionResult<List<RegisteredUser>>> GetAllUsers([FromQuery] int id, [FromQuery] string? test = "")
        //{
        //    var result=await _registeredUserService.GetAllUsers(id, test)!;
        //    if (result == null)
        //        return BadRequest();

        //    return Ok(result);

        //}

        //[HttpPost]
        //public async Task<ActionResult> AddUser([FromBody] RegisteredUser user)
        //{
        //    var result=await _registeredUserService.AddUser(user)!;
        //    if (result == null)
        //        return BadRequest();
        //    return Ok(result);
        //}

        //[HttpDelete("{id}")]
        //public async Task<ActionResult> DeleteUser([FromRoute] int id)
        //{
        //    var result=await _registeredUserService.DeleteUser(id);
        //    if (result != null)
        //        return BadRequest("404");
        //    return Ok(result);
        //}

    }
}
