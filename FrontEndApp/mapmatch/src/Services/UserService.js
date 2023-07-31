import { axiosInstance } from 'utils/http'

class UserService {
    signIn(creds) {
        return axiosInstance.post(`/RegisteredUser/Login`, creds)
    }
    getAllUsers() {
        return axiosInstance.get('/RegisteredUser/GetAllUsers')
    }

    getMyId() {
        return axiosInstance.get('/RegisteredUser/GetId')
    }

    getMyUsername() {
        return axiosInstance.get('/RegisteredUser/GetUsername')
    }

    getIsVisibleValue(id) {
        return axiosInstance.get(`/RegisteredUser/GetIsVisibleValue?id=${id}`)
    }

    setIsVisible(id, visible) {
        return axiosInstance.put(
            `/RegisteredUser/SetIsVisible/${id}?visible=${visible}`
        )
    }

    getAllNearUsers(id) {
        return axiosInstance.get(`/RegisteredUser/GetAllNearUsers?id=${id}`)
    }

    getMyLocation(id) {
        return axiosInstance.get(`/RegisteredUser/GetLocation?id=${id}`)
    }
    setMyLocation(id, lng, lat) {
        return axiosInstance.put(
            `/RegisteredUser/SetLocation?id=${id}&longitude=${lng}&latitude=${lat}`
        )
    }

    getAllFrendsLocations(id) {
        return axiosInstance.get(
            `/RegisteredUser/GetAllFriendsLocation?id=${id}`
        )
    }

    getLocationsFromAllGroups(id) {
        return axiosInstance.get(
            `/RegisteredUser/GetLocationsFromAllGroups?id=${id}`
        )
    }

    getUserIdByUsername(username) {
        return axiosInstance.get(
            `/RegisteredUser/GetUserIdByUsername/${username}`
        )
    }
    getUserFullName(idUser) {
        return axiosInstance.get(`/RegisteredUser/GetFullName/${idUser}`)
    }

    getProfilePhoto(idUser) {
        return axiosInstance.get(`/RegisteredUser/GetProfilePhoto?id=${idUser}`)
    }
    getUserByUsername(username) {
        return axiosInstance.get(
            `/RegisteredUser/FindUserByUsername?username=${username}`
        )
    }
    getUserById(idUser) {
        return axiosInstance.get(`/RegisteredUser/GetUserById/${idUser}`)
    }
    setProfilePhoto(idUser, photo) {
        return axiosInstance.put(
            `/RegisteredUser/SetProfilePhoto?id=${idUser}&photo=${photo}`
        )
    }

    getIdFromUsername(username) {
        return axiosInstance.get(
            `/RegisteredUser/GetIdFromUsername?username=${username}`
        )
    }

    getMyInfo() {
        return axiosInstance.get(`/RegisteredUser/GetMyInfo`)
    }

    setStatus(status) {
        return axiosInstance.put(`/RegisteredUser/SetStatus/${status}`)
    }

    getStatus() {
        return axiosInstance.get(`/RegisteredUser/GetStatus`)
    }

    getRole() {
        return axiosInstance.get(`/RegisteredUser/GetRole`)
    }

    getUserIdByUsername(username) {
        return axiosInstance.get(`/RegisteredUser/GetIdByUsername/${username}`)
    }

    renewToken() {
        return axiosInstance.post(`/RegisteredUser/ExtendToken`);
    }
    getSharedUsers(userId) {
        return axiosInstance.get(`/RegisteredUser/GetSharedUsers/${userId}`)
    }


    isAdmin(userId) {
        return axiosInstance.get(`/RegisteredUser/IsAdmin/${userId}`);
    }

    checkIsUserBanned(userId) {
        return axiosInstance.get(`/RegisteredUser/CheckIsUserBanned/${userId}`);
    }

    BanUser(idUser, numOfDays, numOfHours) {
        return axiosInstance.put(`/RegisteredUser/BanUser/${idUser}/${numOfDays}/${numOfHours}`);
    }

    shareLocation(fromUsername, toUsername) {
        return axiosInstance.post(`/RegisteredUser/ShareLocation/${fromUsername}/${toUsername}`);
    }

    canBeSeen(idUser, usernameMap) {
        return axiosInstance.get(`/RegisteredUser/UserCanSeeUser/${idUser}/${usernameMap}`);
    }
}

export default new UserService()
