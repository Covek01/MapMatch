import { axiosInstance } from "utils/http";

class GroupService{
    addMember(idUser, idGroup){
        return axiosInstance.post(`/Group/AddMember/${idUser}/${idGroup}`);
    }

    getGroups(idUser){
        return axiosInstance.get(`/Group/GetGroupsByUserId/${idUser}`);
    }

    getGroup(idGroup){
        return axiosInstance.get(`/Group/GetGroupById/${idGroup}`);
    }

    addMemberByCode(code, idUser){
        return axiosInstance.post(`/Group/JoinGroupCode/${idUser}`, code);
    }

    userInGroup(idUser, idGroup){
        return axiosInstance.get(`/Group/UserInGroup/${idUser}/${idGroup}`);
    }

    getGroupCode(idGroup){
        return axiosInstance.get(`/Group/GetCode/${idGroup}`);
    }

    getAllMembers(idGroup){
        return axiosInstance.get(`/Group/GetAllMembers/${idGroup}`);
    }
    
    createGroup(group){
        return axiosInstance.post(`/Group/CreateGroup`, group);
    }

    getFriendsNotInGroup(idGroup){
        return axiosInstance.get(`/Group/FriendsNotInGroup/${idGroup}`);
    }

    deleteGroupMember(idGroup, idUser){
        return axiosInstance.put(`/Group/RemoveMember/${idGroup}/${idUser}`);
    }

    deleteGroup(idGroup){
        return axiosInstance.delete(`/Group/DeleteGroup/${idGroup}`);
    }

    getNewCode(idGroup){
        return axiosInstance.get(`/Group/GenerateNewCode/${idGroup}`);
    }

    sendGroupRequest(idSender, isReceiver, idGroup){
        return axiosInstance.post(`/Request/InsertGroupInviteByIDs/${idSender}/${isReceiver}/${idGroup}`);
    }
    

    checkIfGroupRequestExist(idSender, isReceiver, idGroup){
        return axiosInstance.get(`/Request/CheckIfGroupInviteExists/${idSender}/${isReceiver}/${idGroup}`);
    }

    getGroupAdmin(idGroup){
        return axiosInstance.get(`/Group/GetGroupAdminId/${idGroup}`);
    }

    DisableGroupCode(idGroup){
        return axiosInstance.put(`/Group/DisableCode/${idGroup}`);
    }

    EnableGroupCode(idGroup){
        return axiosInstance.put(`/Group/EnableCode/${idGroup}`);
    }

   SetGroupPhoto(idGroup,photoPath){
    return axiosInstance.put(`/Group/SetGroupPhoto/${idGroup}?photoPath=${photoPath}`);
   }
    

}

export default new GroupService();