import RequestUtility from "./RequestUtility"
import axios from 'axios'
import RequestService from "Services/RequestService"
import FriendshipService from "Services/FriendshipService"
import UserService from "Services/UserService"

class LocationShareUtility{
    getColorHexa(){
        return "#ffb74d";
    }

    async acceptRequest(request){
        try{
            const myusername = (await UserService.getMyUsername()).data;
            await UserService.shareLocation(request.receiverUsername,request.refersToUsername);
            await RequestService.DeleteLocationShareRequest(request.senderUsername,request.receiverUsername,request.refersToUsername);
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
            await RequestService.DeleteLocationShareRequest(request.senderUsername,request.receiverUsername,request.refersToUsername);
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }

    }
}

export default LocationShareUtility;