import RequestUtility from "./RequestUtility"
import axios from 'axios'
import RequestService from "Services/RequestService"
import FriendshipService from "Services/FriendshipService"
import UserService from "Services/UserService"

class ReportUtility{
    getColorHexa(){
        return "#e57373";
    }

    async acceptRequest(request){
        try{
            const myusername = (await UserService.getMyUsername()).data;
            const receiverId = request.refersToId
            await UserService.BanUser(request.refersToId, 0, 1);
            await RequestService.DeleteReport(request.receiverUsername, request.senderUsername);
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
            await RequestService.DeleteReport(request.receiverUsername, request.senderUsername);
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }

    }

    async sendRequest(idReporter, idReported, message){
        try{
            await RequestService.InsertReportByIds(idReporter, idReported, message);
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }

    }
}

export default ReportUtility;