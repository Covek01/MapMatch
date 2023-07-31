import { axiosInstance } from 'utils/http'

class FriendshipService {
    InsertFriendship(idOwner, idReceiver) {
        return axiosInstance.post(
            `/Friendship/InsertFriendship/${idOwner}/${idReceiver}`
        )
    }

    DeleteFriendship(idOwner, idReceiver) {
        return axiosInstance.delete(
            `/Friendship/DeleteFriendship/${idOwner}/${idReceiver}`
        )
    }

    DeleteFriendshipByUsername(owner, receiver) {
        return axiosInstance.delete(
            `/Friendship/DeleteFriendshipByUsername/${owner}/${receiver}`
        )
    }

    GetFriendsForUser(idUser) {
        return axiosInstance.get(`/Friendship/GetFriendsForUser/${idUser}`)
    }

    GetFriendsForUserByUsername(user) {
        return axiosInstance.get(
            `/Friendship/GetFriendsForUserByUsername/${user}`
        )
    }

    GetNumberOfFriendsForUser(idUser) {
        return axiosInstance.get(
            `/Friendship/GetNumberOfFriendsForUser/${idUser}`
        )
    }

    GetNumberOfFriendsForUserByUsername(user) {
        return axiosInstance.get(
            `/Friendship/GetNumberOfFriendsForUserByUsername/${user}`
        )
    }

    GetFriendshipRoomName(idFriend1, idFriend2) {
        return axiosInstance.get(
            `/Friendship/FriendshipRoomName/${idFriend1}/${idFriend2}`
        )
    }
    ReturnFriendRequests(idUser) {
        return axiosInstance.get(`/Request/ReturnFriendRequests/${idUser}`)
    }

    GetNonMutualFriends(idHasFr,idNotHaveFr){
        return axiosInstance.get(`/Friendship/GetNonMutualFriends/${idHasFr}/${idNotHaveFr}`);
    }

    CheckIfFriendshipExists(idUser1, idUser2) {
        return axiosInstance.get(`/Friendship/CheckIfFriendshipExists/${idUser1}/${idUser2}`)
    }

    GetMutualFriends(idUser1, idUser2) {
        return axiosInstance.get(`/Friendship/GetMutualFriends/${idUser1}/${idUser2}`)
    }
}

export default new FriendshipService()
