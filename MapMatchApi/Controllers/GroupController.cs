using MapMatchApi.Services.GroupService;
using MapMatchApi.Services.RegisteredUserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MapMatchApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly IGroupService _groupService;


        public GroupController(IGroupService groupService)
        {
            _groupService = groupService;

        }

        [HttpPost("CreateGroup"),Authorize(Roles="user,admin")]
        public async Task<ActionResult> CreateGroup([FromBody] GroupBasic g)
        {
            try
            {
                return Ok(await _groupService.CreateGroup(g));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AddMember/{userId}/{groupId}"),Authorize(Roles="user,admin")]
        public async Task<ActionResult> AddMember([FromRoute] int userId, [FromRoute] int groupId)
        {
            try
            {
                var result=await _groupService.AddUser(userId, groupId);
                return Ok(result);  
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllMembers/{groupId}"),Authorize(Roles="user,admin")]
        public async Task<ActionResult> GetAllMembers([FromRoute] int groupId)
        {
            try
            {
                return Ok(await _groupService.GetAllGroupUsers(groupId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteGroup/{groupId}"),Authorize(Roles="user,admin")]
        public async Task<ActionResult> DeleteGroup([FromRoute]int groupId)
        {
            try
            {
                await _groupService.DeleteGroup(groupId);
                return Ok("deleted");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("RemoveMember/{groupId}/{userId}"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> RemoveMember(int groupId,int userId)
        {
            try
            {
                var result=await _groupService.RemoveUser( userId,groupId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetCode/{groupId}"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> GetCode(int groupId)
        {
            try
            {
                var result = await _groupService.GetCode(groupId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetGroupPhoto/{groupId}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetGroupPhoto(int groupId)
        {
            try
            {
                var result = await _groupService.GetGroupPhoto(groupId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GenerateNewCode/{groupId}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GenerateNewCode(int groupId)
        {
            try
            {
                var result = await _groupService.GenerateNewCode(groupId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("DisableCode/{groupId}"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> DisableCode(int groupId)
        {
            try
            {
                await _groupService.DisableCode(groupId);
                return Ok("disabled");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("EnableCode/{groupId}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> EnableCode(int groupId)
        {
            try
            {
                var result=await _groupService.EnableCode(groupId);
                return Ok("enabled");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("SetGroupPhoto/{groupId}"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> SetGroupPhoto(int groupId,[FromQuery] string photoPath)
        {
            try
            {
                var result = await _groupService.SetGroupPhoto(groupId, photoPath);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("UserInGroup/{userId}/{groupId}"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> UserInGroup(int userId,int groupId)
        {
            try
            {
                var result = await _groupService.UserInGroup(userId, groupId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("FriendsNotInGroup/{groupId}"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> FriendsNotInGroup(int groupId)
        {
            try
            {
                var res=await _groupService.FriendsNotInGroup(groupId);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("JoinGroupCode/{userId}"),Authorize(Roles ="user,admin")]
        
        public async Task<ActionResult> JoinGroupCode([FromRoute]int userId, [FromBody] string code)
        {
            try
            {
               var result= await _groupService.JoinGroupCode(code, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);  
            }
        }

        [HttpGet("GetGroupById/{idGroup}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetGroupById(int idGroup)
        {
            try
            {
                var result = await _groupService.GetGroupById(idGroup);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetGroupsByUserId/{idUser}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetGroupsByUserId(int idUser)
        {
            try
            {
                var result = await _groupService.GetGroupsByUserId(idUser);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetGroupAdminId/{groupId}"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> GetGroupAdminId(int groupId)
        {
            try
            {
                var result = await _groupService.GetGroupAdmin(groupId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
