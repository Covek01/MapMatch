import { axiosInstance } from "utils/http";

class RequestService{
    ReturnFriendRequestsForUser(id){
       return axiosInstance.get(`/Request/ReturnFriendRequests/${id}`); 
    }

    ReturnRequestsById(id){
        return axiosInstance.get(`/Request/ReturnRequestsByID/${id}`); 
    }

    ReturnRequestsExceptReportsById(idReceiver){
        return axiosInstance.get(`/Request/ListAllRequestsExceptReportsForUserById/${idReceiver}`); 
    }

    ReturnRequestsExceptReportsById(idReceiver){
        return axiosInstance.get(`/Request/ListAllRequestsExceptReportsForUserById/${idReceiver}`); 
    }

    ReturnReportsToAdmin(idAdmin){
        return axiosInstance.get(`/Request/ListAllReportsReferedToAdmin/${idAdmin}`); 
    }

    CheckIfFriendRequestExists(idSender, idReceiver){
        return axiosInstance.get(`/Request/CheckIfFriendRequestExists/${idSender}/${idReceiver}`); 
    }


    InsertFriendRequestsByIds(idSender, idReceiver){
        return axiosInstance.post(`/Request/InsertFriendRequestByIDs/${idSender}/${idReceiver}`); 
    }

    InsertLocationShareRequestByIds(idSender, idReceiver,idRefered){
        return axiosInstance.post(`/Request/InsertLocationShareRequestByIDs/${idSender}/${idReceiver}/${idRefered}`); 
    }

    InsertGroupInviteByIds(idSender, idReceiver, idGroup){
        return axiosInstance.post(`/Request/InsertGroupInviteByIDs/${idSender}/${idReceiver}/${idGroup}`); 
    }

    InsertReportByIds(idSender, idReceiver, reason){
        return axiosInstance.post(`/Request/InsertReportByIDs/${idSender}/${idReceiver}/${reason}`); 
    }

    DeleteRequest(idRequest){
        return axiosInstance.delete(`/Request/DeleteRequest/${idRequest}`); 
    }

    DeleteFriendRequest(usernameProfile, usernameSender){
        return axiosInstance.delete(`/Request/DeleteFriendRequest/${usernameProfile}/${usernameSender}`); 
    }

    DeleteFriendRequestByIds(idSender, idReceiver){
        return axiosInstance.delete(`/Request/DeleteFriendRequestByIDs/${idSender}/${idReceiver}`); 
    }

    DeleteLocationShareRequest(senderUsername,recvUsername, referedUsername){
        return axiosInstance.delete(`/Request/DeleteLocationShareRequest/${senderUsername}/${recvUsername}/${referedUsername}`); 
    }

    DeleteReport(usernameProfile, usernameSender){
        return axiosInstance.delete(`/Request/DeleteReport/${usernameProfile}/${usernameSender}`); 
    }

    DeleteReportByIf(idSender, idReceiver){
        return axiosInstance.delete(`/Request/DeleteReportByID/${idSender}/${idReceiver}`); 
    }

    DeleteReportById(idSender, idReceiver){
        return axiosInstance.delete(`/Request/DeleteLocationReportByID/${idSender}/${idReceiver}`); 
    }

    DeleteGroupInviteRequest(usernameProfile, usernameSender){
        return axiosInstance.delete(`/Request/DeleteGroupInviteRequest/${usernameProfile}/${usernameSender}`); 
    }

    DeleteGroupInviteRequestById(idSender, idReceiver){
        return axiosInstance.delete(`/Request/DeleteGroupInviteRequestByID/${idSender}/${idReceiver}`); 
    }

    RejectFriendRequest(idSender, idReceiver){
        return axiosInstance.put(`/Request/RejectFriendRequest/${idSender}/${idReceiver}`); 
    }

    CleanAllReports(){
        return axiosInstance.put(`/Request/CleanAllReports`); 
    }

    CleanAllOldFriendRequests(idUser){
        return axiosInstance.delete(`/Request/CleanAllOldFriendRequests/${idUser}`); 
    }

    IsShareRequestSent(idSender,idRecv,idRef){
        return axiosInstance.get(`/Request/CheckIfShareExists/${idSender}/${idRecv}/${idRef}/Location share`);
    }



}

export default new RequestService();