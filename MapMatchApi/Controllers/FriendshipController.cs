using MapMatchApi.Services.FriendshipService;
using MapMatchApi.Services.MessageService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MapMatchApi.Controllers
{
    public class FriendshipController : Controller
    {

        private readonly IFriendshipService _friendshipService;
        private readonly IMessageService _messageService;

        public FriendshipController(IFriendshipService friendshipService, IMessageService messageService)
        {
            _friendshipService = friendshipService;
            _messageService = messageService;
        }

        [HttpPost("api/[controller]/InsertFriendship/{idSender}/{idReceiver}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> InsertFriendship(int idSender, int idReceiver)
        {
            try
            {
                await _friendshipService.InsertFriendship(idSender, idReceiver);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

            return Ok("Friendship inserted successfully");
        }

        [HttpGet("api/[controller]/GetFriendsForUser/{idUser}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetFriendsForUser(int idUser)
        {
            List<RegisteredUser> friends;
            try
            {
                friends = await _friendshipService.GetFriendsOfUser(idUser);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

            return Ok(friends);
        }

        [HttpGet("api/[controller]/GetFriendsForUserByUsername/{user}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetFriendsForUserByUsername(string user)
        {
            List<RegisteredUser> friends;
            try
            {
                friends = await _friendshipService.GetFriendsOfUser(user);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

            return Ok(friends);
        }

        [HttpGet("api/[controller]/GetNumberOfFriendsForUser/{idUser}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetNumberOfFriendsForUser(string idUser)
        {
            int number;
            try
            {
               number =  await _friendshipService.GetNumberOfFriendsForUser(idUser);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

            return Ok(number);
        }

        [HttpGet("api/[controller]/GetNumberOfFriendsForUserByUsername/{user}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetNumberOfFriendsForUserByUsername(string user)
        {
            int number;
            try
            {
                number = await _friendshipService.GetNumberOfFriendsForUser(user);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

            return Ok(number);
        }

        [HttpGet("api/[controller]/GetMutualFriends/{idUser1}/{idUser2}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetMutualFriends(int idUser1, int idUser2)
        {
            try
            {
                var friends = await _friendshipService.GetMutualFriends(idUser1, idUser2);


                return Ok(friends);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

        }

        [HttpGet("api/[controller]/FriendshipRoomName/{idFriend1}/{idFriend2}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetFriendshipRoomName(int idFriend1, int idFriend2)
        {
            string roomName;
            try
            {
                roomName = await _friendshipService.FriendshipRoomName(idFriend1, idFriend2);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

            return Ok(roomName);
        }

        [HttpDelete("api/[controller]/DeleteFriendship/{idFriend1}/{idFriend2}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteFriendship(int idFriend1, int idFriend2)
        {
            try
            {
                await _friendshipService.DeleteFriendship(idFriend1, idFriend2);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

            return Ok("Friendship successfully deleted");
        }

        [HttpDelete("api/[controller]/DeleteFriendshipByUsername/{username1}/{username2}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> DeleteFriendshipByUsername(string username1, string username2)
        {
            try
            {
                await _friendshipService.DeleteFriendship(username1, username2);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

            return Ok("Friendship successfully deleted");
        }

        [HttpGet("api/[controller]/GetNonMutualFriends/{hasFriends}/{notHaveFriends}"),Authorize(Roles ="user,admin")]
        public async Task<ActionResult> GetNonMutualFriends(int hasFriends, int notHaveFriends)
        {
            try
            {
                var result = await _friendshipService.GetNonMutualFriends(hasFriends, notHaveFriends);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("api/[controller]/CheckIfFriendshipExists/{idUser1}/{idUser2}"), Authorize(Roles = "user,admin")]
        public async Task<ActionResult> CheckIfFriendshipExists(int idUser1, int idUser2)
        {
            try
            {
                bool flag = await _friendshipService.FriendshipExists(idUser1, idUser2);


                return Ok(flag);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }

        }

    }
}
