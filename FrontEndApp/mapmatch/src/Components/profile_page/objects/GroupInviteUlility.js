import RequestUtility from "./RequestUtility"
import axios from 'axios'
import RequestService from "Services/RequestService"
import FriendshipService from "Services/FriendshipService"
import UserService from "Services/UserService"
import GroupService from "Services/GroupService"

class GroupInviteUtility{
    getColorHexa(){
        return "#4fc3f7";
    }

    async acceptRequest(request){
        try{
            const senderId = (await UserService.getUserIdByUsername(request.senderUsername)).data;
            const myid = (await UserService.getMyId()).data;
            const myusername = (await UserService.getMyUsername()).data;
            
            
            await GroupService.addMember(myid, request.referedGroup.id);
            await RequestService.DeleteGroupInviteRequest(myusername, request.senderUsername);
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }
    }

    async rejectRequest(request){
        try{
            const myusername = (await UserService.getMyUsername()).data;
            await RequestService.DeleteGroupInviteRequest(myusername, request.senderUsername);
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }

    }

    async sendRequest(idSender, idReceiver, idGroup){

    }
}

export default GroupInviteUtility;