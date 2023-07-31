using Microsoft.AspNetCore.SignalR;

namespace MapMatchApi.Hubs
{
    public class OnlineHub : Hub
    {
        public readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;
        private readonly string _room;

        public OnlineHub(IDictionary<string, UserConnection> connections)
        {
            _botUser = "MyChat bot";
            _connections = connections;
            _room = "MapMatch";
        }

        public async Task SendNotification(string receiver, string type)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection connection))
            {
                await Clients.User(connection.User).SendAsync("ReceiveNotification", type, connection.User);
                //await Clients.Group(connection.Room).SendAsync("ReceiveNotification", connection.User, message);
            }
        }

        public async Task SetMyUsername(string username)
        {
            _connections[Context.ConnectionId] = new UserConnection(username, _room);
        }

        public async Task JoinRoom()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, _room);
            //_connections[Context.ConnectionId] = new UserConnection(user, room);
            //await Clients.All.SendAsync("ReceiveMessage", user, "Hey everyone");
        }

    }
}
