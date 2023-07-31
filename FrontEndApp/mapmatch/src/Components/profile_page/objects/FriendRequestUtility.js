import RequestUtility from "./RequestUtility"
import axios from 'axios'
import RequestService from "Services/RequestService"
import FriendshipService from "Services/FriendshipService"
import UserService from "Services/UserService"

class FriendRequestUtility{
    getColorHexa(){
        return "#ffb74d";
    }

    async acceptRequest(request){
        try{
            const senderId = (await UserService.getUserIdByUsername(request.senderUsername)).data;
            const myid = (await UserService.getMyId()).data;
            await FriendshipService.InsertFriendship(senderId, myid);
            
            const myusername = (await UserService.getMyUsername()).data;
            await RequestService.DeleteFriendRequest(myusername, request.senderUsername);
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }
    }

    async rejectRequest(request){
        try{
            const senderId = (await UserService.getUserIdByUsername(request.senderUsername)).data;
            const myid = (await UserService.getMyId()).data;
            await RequestService.RejectFriendRequest(senderId, myid);
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }
    }
    

    async sendRequest(idSender, idReceiver){
        try{
            await RequestService.InsertFriendRequestsByIds(idSender, idReceiver);
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }
    }

    async sendRequestFromMe(idReceiver){
        const myid = (await UserService.getMyId()).data
        try{
            await RequestService.InsertFriendRequestsByIds(myid, idReceiver);
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }
    }

    async unsendRequestFromMe(idReceiver){

        const myid = (await UserService.getMyId()).data
        
        try{
            await RequestService.DeleteFriendRequestByIds(myid, idReceiver)
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }
    }

    async unfriendFromMe(idReceiver){
        const myid = (await UserService.getMyId()).data
        await FriendshipService.DeleteFriendship(myid, idReceiver)
    }
}

export default FriendRequestUtility;