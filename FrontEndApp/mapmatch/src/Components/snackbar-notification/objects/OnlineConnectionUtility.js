import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import RequestUtilityFactory from "Components/profile_page/objects/RequestUtilityFactory";


async function joinRoom(user, roomName){
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7229/online")
        .configureLogging(LogLevel.Information)
        .build();
  
      await connection.start();
      await connection.invoke("JoinRoom");
      return connection;

    } catch (e) {
      console.log(e);
    }
}

class OnlineConnectionUtility{

    constructor(){
        this.connection = joinRoom();
        this.utility = null;
        
    }

}

export default new OnlineConnectionUtility();