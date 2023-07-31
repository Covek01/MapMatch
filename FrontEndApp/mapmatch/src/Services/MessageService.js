import { axiosInstance } from "utils/http";

class MessageService{
    AddDirectMessage(idSender, idReceiver, message){
        return axiosInstance.post(`/Message/AddDirectMessage/${idSender}/${idReceiver}`, message);
    }

    AddGroupMessage(idSender, idGroup, message){
        return axiosInstance.post(`/Message/AddGroupMessage/${idSender}/${idGroup}`, message);
    }

    AddPoll(idGroup, minsToLive, pollName, message){
        return axiosInstance.post(`/Message/AddPoll?idGroup=${idGroup}&minsToLive=${minsToLive}&pollName=${pollName}`, {message});
    }

    GetAllDirectMessages(idSender, idReceiver){
        return axiosInstance.get(`/Message/GetAllDirectMessages/${idSender}/${idReceiver}`);
    }

    GetAllGroupMessages(idGroup){
        return axiosInstance.get(`/Message/GetAllGroupMessages/${idGroup}`);
    }

    GetAllChatsForUser(idUser){
        //return axiosInstance.get(`/Message/ReturnAllChatsInOrder?userId=${idUser}`);
        return axiosInstance.get(`/Message/ReturnAllChatsInOrder/${idUser}`);
        // return axiosInstance.get(`/Message/ReturnAllChatsInOrder`, {params: {
        //     userId: idUser
        // }});

        // const chatsJSON = await fetch(`http://localhost:5123/api/Message/ReturnAllChatsInOrder/${idUser}`, {
        //     method: 'GET',
        //     mode: 'cors',
        //     headers: {
        //       'Access-Control-Allow-Origin':'*'
        //     }
        //   });
        // const chats = chatsJSON.json();
        // return chats;
    }

    GetAllDirectMessagesFromTo(idSender, idReceiver){
        return axiosInstance.get(`/Message/GetAllDirectMessages/idGroup=${idSender}&idRecv=${idReceiver}`);
    }

    GetAllDirectMessagesFromToWithShift(idSender, idReceiver, shiftLeft, number){
        return axiosInstance.get(`/Message/GetAllDirectMessagesFromTo/${idSender}/${idReceiver}/${shiftLeft}/${number}`);
    }

}

export default new MessageService();