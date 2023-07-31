using MapMatchApi.Services.GroupService;
using MapMatchApi.Services.MessageService;
using MapMatchApi.Services.RegisteredUserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MapMatchApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessageController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpPost("AddDirectMessage/{idSender}/{idRecv}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> AddDirectMessage(int idSender, int idRecv, [FromBody] string text)
        {
            try
            {
                await _messageService.AddDirectMessage(idSender, idRecv, text);
                return Ok("dodato");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AddGroupMessage/{idSender}/{idGroup}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> AddGroupMessage(int idSender, int idGroup, [FromBody] string text)
        {
            try
            {
                await _messageService.AddGroupMessage(idSender, idGroup, text);
                return Ok("dodato");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AddPoll/{idGroup}/{minsToLive}/{pollName}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> AddPoll(int idGroup, int minsToLive, string pollName, [FromBody] string text)
        {
            try
            {
                await _messageService.AddPoll(idGroup, minsToLive, pollName, text);
                return Ok("dodato");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllDirectMessages/{idSender}/{idRecv}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllDirectMessages(int idSender, int idRecv)
        {
            try
            {
                var result = await _messageService.GetAllDirectMessages(idSender, idRecv);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetAllDirectMessagesFromTo/{idSender}/{idRecv}/{shiftLeft}/{number}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllDirectMessages(int idSender, int idRecv, int shiftLeft, int number)
        {
            try
            {
                var result = await _messageService.GetAllDirectMessagesFromTo(idSender, idRecv, shiftLeft, number);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetAllGroupMessages/{idSender}/{idGroup}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllGroupMessages(int idSender, int idGroup)
        {
            try
            {
                var result = await _messageService.GetAllGroupMessages(idSender, idGroup);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllGroupMessages/{idGroup}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllGroupMessages(int idGroup)
        {
            try
            {
                var result = await _messageService.GetAllGroupMessages(idGroup);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllGroupMessagesFromTo/{idSender}/{idGroup}/{shiftLeft}/{number}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllGroupMessagesFromTo(int idSender, int idGroup, int shiftLeft, int number)
        {
            try
            {
                var result = await _messageService.GetAllGroupMessagesFromTo(idSender, idGroup, shiftLeft, number);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet("GetAllGroupPolls/{idSender}/{idGroup}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllGroupPolls(int idSender, int idGroup)
        {
            try
            {
                var result = await _messageService.GetAllGroupPolls(idSender, idGroup);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("VoteYes/{pollId}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> VoteYes(int pollId)
        {
            try
            {
                var result = await _messageService.VoteYes(pollId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("VoteNo/{pollId}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> VoteNo(int pollId)
        {
            try
            {
                var result = await _messageService.VoteNo(pollId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ReturnAllChatsInOrder/{userId}"),Authorize(Roles="user,admin")]
        public async Task<ActionResult> ReturnAllChatsInOrder(int userId)
        {
            try
            {
                var result = await _messageService.RetrunAllChatsInOrder(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
