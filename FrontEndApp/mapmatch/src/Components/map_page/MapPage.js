import React, { useState, useEffect } from "react";
import MapHeader from "./MapHeader";
import MapMainContent from "./MapMainContent";
import { useSnackbar } from "Context/SnackbarContext/SnackbarContext";
import { useAuthContext } from "Context/AuthContext/AuthContext";
import UserService from "Services/UserService";
import axios from "axios";
import { useRouteError, useSearchParams } from "react-router-dom";
import { NearMeDisabled } from "@mui/icons-material";
import { LoadingSpinner } from "Components/loadingSpinner/LoadingSpinner";

// import { useId } from "react";



const OTHER_USERS_INFO_MOCK_DATA = [
    {
        lat: 43.31689180423383,
        lng: 21.93269982036258,
        name: "Stefan",
        isFriend: true,
    },
    {
        lat: 43.31689180423383,
        lng: 21.8963076114043,
        name: "Mina",
        isFriend: false,
    }
];

export default function MapPage({ userProfile }) {
    const [loading, setLoading] = useState(true);

    const refreshTime = 60000;
    const [userId, setUserId] = useState(-1);
    const [nearUsers, setNearUsers] = useState(null);
    const [friends, setFriends] = useState(null);
    const [groupMembers, setGroupMembers] = useState(null);
    const [sharers, setSharers] = useState(null);

    const [myLocation, setMyLocation] = useState(null);

    const [selectedUserIndex, setSelectedUserIndex] = useState(null);
    const [otherUsersData, setOtherUsersData] = useState([]);
    const [otherUsersInfo, setOtherUsersInfo] = useState(null);
    const [defaultCenter, setDefaultCenter] = useState(null);
    const [defaultZoom, setDefaultZoom] = useState(null);
    const [singletonCheck, setSingletonCheck] = useState(null);
    const [currentCenter, setCurrentCenter] = useState(null);

    const [searchClicked, setSearchClicked] = useState(false);
    const [locationAccess, setLocationAccess] = useState(null);

    const { openSnackbar } = useSnackbar();
    const { isAuthenticated, signIn, user, signOut } = useAuthContext();

    useEffect(() => {
        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
            setLocationAccess(permissionStatus.state == "granted");
            //console.log("Location acces has just been set to:", permissionStatus.state == "granted");

            permissionStatus.onchange = () => {
                // console.log(
                //     `geolocation permission state has changed to ${permissionStatus.state}`
                // );
                setLocationAccess(permissionStatus.state == "granted");
                // console.log("Location acces has just been set to:", permissionStatus.state == "granted");
                const setMyLocationDetection = async () => {
                    try {
                        const { data, status } = await UserService.setIsVisible(userId, permissionStatus.state == "granted")
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            console.error(error.message);
                        }
                    }
                }

                setMyLocationDetection();
            };


        });

    }, [userId]);

    useEffect(() => {
        const getMyId = async () => {
            try {
                const { data, status } = await UserService.getMyId();
                if (status == 200) {
                    setUserId(data);
                    //console.log("MapPage getMYId:", data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message);
                }
            }
        }
        setLoading(true)
        getMyId();

    }, [])




    const getBrowserLocation = () => {
        //console.log("getBrowserLocation");
        navigator.geolocation.getCurrentPosition((position) => {
            //console.log(position);
            //console.log("setMyLocation");
            setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            //console.log(myLocation, "Log From getBrowserLocation");
        });
    };

    useEffect(() => {
        if (myLocation != null) {
            const setMyLocationInDatabase = async () => {
                try {
                    const { data, status } = await UserService.setMyLocation(userId, myLocation.lng, myLocation.lat);
                    if (status == 200) {
                        console.log("Location updated POSEBAN USE EFFECT", myLocation);
                    }

                } catch (error) {
                    // if (axios.isAxiosError(error)) {
                    //     console.error(error.message);
                    // }
                    console.error(error);
                }
            }
            setMyLocationInDatabase();
        }
    }, [myLocation])

    useEffect(() => {

        //console.log("desava se nesto ");

        if (locationAccess && userId != -1) {
            let locationPom = myLocation;
            navigator.geolocation.getCurrentPosition((position) => {
                console.log("OVDE SETUJE");
                setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                locationPom = { lat: position.coords.latitude, lng: position.coords.longitude };
            }, (error) => {
                console.error(error);
            });
            // const setMyLocationInDatabase = async () => {
            //     try {
            //         const { data, status } = await UserService.setMyLocation(userId, locationPom.lng, locationPom.lat);
            //         if (status == 200) {
            //             console.log("Location updated", myLocation);
            //         }

            //     } catch (error) {
            //         // if (axios.isAxiosError(error)) {
            //         //     console.error(error.message);
            //         // }
            //         console.error(error);
            //     }
            // }
            // if (myLocation)
            //     setMyLocationInDatabase();
            // console.log(myLocation, "ovo je my location");

            const getNearLocations = async () => {
                try {
                    const { data, status } = await UserService.getAllNearUsers(userId);
                    if (status == 200)
                        setNearUsers(data);
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(error.message);
                    }
                }
            }

            getNearLocations();
        }
        else { setMyLocation(null) }

        const getFriendsLocation = async () => {
            try {
                const { data, status } = await UserService.getAllFrendsLocations(userId)
                if (status == 200) {
                    setFriends(data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message);
                }
            }
        }
        if (userId != -1)
            getFriendsLocation();

        const getGroupMembersLocation = async () => {
            try {
                const { data, status } = await UserService.getLocationsFromAllGroups(userId);
                if (status == 200) {
                    setGroupMembers(data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message);
                }
            }
        }
        if (userId != -1)
            getGroupMembersLocation();

        const getSharedLocation = async () => {
            try {
                const { data, status } = await UserService.getSharedUsers(userId);
                if (status == 200) {
                    setSharers(data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message);
                }
            }
        }
        if (userId != -1)
            getSharedLocation();

        const interval = setInterval(() => {
            console.log("Location acces is", locationAccess);
            if (locationAccess && userId != -1) {
                let locationPom = myLocation;
                navigator.geolocation.getCurrentPosition((position) => {
                    console.log("OVDE SETUJE", position);
                    setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                    locationPom = { lat: position.coords.latitude, lng: position.coords.longitude };
                }, (error) => {
                    console.error(error);
                });
                // const setMyLocationInDatabase = async () => {
                //     try {
                //         const { data, status } = await UserService.setMyLocation(userId, locationPom.lng, locationPom.lat);
                //         if (status == 200) {
                //             console.log("Location updated", myLocation);
                //         }

                //     } catch (error) {

                //         console.error(error);

                //     }
                // }
                // if (myLocation)
                //     setMyLocationInDatabase();

                //console.log(myLocation, "ovo je my location");
                const getNearLocations = async () => {
                    try {
                        const { data, status } = await UserService.getAllNearUsers(userId);
                        if (status == 200)
                            setNearUsers(data);
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            console.error(error.message);
                        }
                    }
                }
                getNearLocations();
            }
            else {
                setMyLocation(null);
            }

            const getFreiendsLocation = async () => {
                try {
                    const { data, status } = await UserService.getAllFrendsLocations(userId)
                    if (status == 200) {
                        setFriends(data);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(error.message);
                    }
                }
            }
            if (userId != -1)
                getFreiendsLocation();

            const getGroupMembersLocation = async () => {
                try {
                    const { data, status } = await UserService.getLocationsFromAllGroups(userId);
                    if (status == 200) {
                        setGroupMembers(data);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(error.message);
                    }
                }
            }
            if (userId != -1)
                getGroupMembersLocation();

            const getSharedLocation = async () => {
                try {
                    const { data, status } = await UserService.getSharedUsers(userId);
                    if (status == 200) {
                        setSharers(data);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(error.message);
                    }
                }
            }
            if (userId != -1)
                getSharedLocation();
            // const getMyLocation=async()=>{
            //     try {
            //         const{data,status}=await UserService.getMyLocation(userId);
            //         if(status==200){
            //             setMyLocation(data)
            //         }

            //     } catch (error) {
            //         if(axios.isAxiosError(error))
            //         setMyLocation(null);
            //     }
            // }



            // getMyLocation();

            //   console.log("desava se");
        }, refreshTime);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [userId, locationAccess])

    // useEffect(() => {
    //     // fetch data from server
    //     console.log("here1");
    //     console.log(isAuthenticated);
    //     setOtherUsersInfo(OTHER_USERS_INFO_MOCK_DATA);
    //     openSnackbar({ message: "Ovo je snackbar", severity: "info" });
    // }, []); // pogledaj kako se useEffect izvrsava jednom - [] ili bez drugog parametra

    // useEffect(() => {
    //     // console.log("here2");
    //     getBrowserLocation();
    //     const getAllUsers = async () => {
    //         const { data, status } = await UserService.getAllUsers();
    //     }
    //     getAllUsers();
    // }, []); // isto samo jednom
    // // console.log(otherUsersInfo);

    function FriendsGroup() {
        //NE MOZES DA MENJAS STATE I DA GA KORISTIS ODMAH MORA U POMOCNU 
        const pom = [];

        for (let i = 0; i < friends.length; i++) {
            let found = false;
            for (let j = 0; j < groupMembers.length; j++) {
                if (friends[i].id == groupMembers[j].id) {
                    // setOtherUsersData(prev => {
                    // console.log("just added one 3");

                    //     return [...prev, { ...groupMembers[j], isInSameGroup: true, isFriend: true }];
                    // })

                    pom.push({ ...groupMembers[j], isUser: false, isInSameGroup: true, isFriend: true, isNear: false, isShared: false });
                    found = true;
                }
            }
            if (!found) {
                // setOtherUsersData(prev => {
                //     console.log("just added one 2");

                //     return [...prev, { ...friends[i], isInSameGroup: false, isFriend: true }];
                // })

                pom.push({ ...friends[i], isUser: false, isInSameGroup: false, isFriend: true, isNear: false, isShared: false });
            }
        }



        for (let j = 0; j < groupMembers.length; j++) {
            let found = false;
            //console.log("Important check", pom.length);//otherUsersData.length);
            for (let k = 0; k < pom.length; k++) {//otherUsersData.length; k++) {
                //console.log("ULTIAMTE TEST",groupMembers[j].id == otherUsersData[k].id,j,k,groupMembers[j].id,otherUsersData[k].id);
                // if (groupMembers[j].id == otherUsersData[k].id) {
                //     found = true
                //     console.log("stuff is happening here", j, k);
                // }
                if (groupMembers[j].id == pom[k].id) {
                    found = true
                    //  console.log("stuff is happening here", j, k);
                }
            }
            if (!found) {
                // setOtherUsersData(prev => {
                //     console.log("just added one 1");
                //     return [...prev, { ...groupMembers[j], isInSameGroup: true, isFriend: false }];
                // })
                pom.push({ ...groupMembers[j], isUser: false, isInSameGroup: true, isFriend: false, isNear: false, isShared: false });

            }
        }

        for (let i = 0; i < sharers.length; i++) {
            let found = false;
            for (let j = 0; j < pom.length; j++) {
                if (pom[j].id === sharers[i].id) {
                    found = true;
                    pom[j].isShared = true;
                }
            }
            if (!found) {
                pom.push({ ...sharers[i], isUser: false, isInSameGroup: false, isFriend: false, isNear: false, isShared: true });
            }
        }

        setOtherUsersData((prev) => {
            return [...prev, ...pom];
        })
        return [...pom];
    }




    useEffect(() => {
        setOtherUsersData([]);
        let pom = [];
        // console.log("ulazi u ovaj effect");
        if (myLocation == null && locationAccess === false && userId != null) {

            if (friends !== null && groupMembers !== null && sharers !== null) {
                pom = FriendsGroup();
                //console.log("Called FREIND GROUP1");

                let defaultCenterPom = { lat: 0, lng: 0 };
                let maxE = -180, maxW = 180, maxN = -90, maxS = 90;
                for (let i = 0; i < pom.length; i++) {
                    defaultCenterPom.lat += Number(pom[i].latitude);
                    defaultCenterPom.lng += Number(pom[i].longitude);
                    if (pom[i].longitude > maxE) maxE = pom[i].longitude;
                    if (pom[i].longitude < maxW) maxW = pom[i].longitude;
                    if (pom[i].latitude > maxN) maxN = pom[i].latitude;
                    if (pom[i].latitude < maxS) maxS = pom[i].latitude;


                }
                defaultCenterPom.lat /= pom.length == 0 ? 1 : pom.length;
                defaultCenterPom.lng /= pom.length == 0 ? 1 : pom.length;


                // console.log("Check lat lng ", defaultCenterPom.lat, defaultCenterPom.lng);
                if (singletonCheck == null) {
                    setDefaultCenter({ lat: defaultCenterPom.lat, lng: defaultCenterPom.lng });
                    setCurrentCenter({ lat: defaultCenterPom.lat, lng: defaultCenterPom.lng });
                } else {
                    setCurrentCenter({ lat: defaultCenterPom.lat, lng: defaultCenterPom.lng });
                }
                let distSirina = 2 * (defaultCenterPom.lat - maxS > maxN - defaultCenterPom.lat ? defaultCenterPom.lat - maxS : maxN - defaultCenterPom.lat);
                let distDuzina = 2 * (defaultCenterPom.lng - maxW > maxE - defaultCenterPom.lng ? defaultCenterPom.lng - maxW : maxE - defaultCenterPom.lng);
                let maxDist = 180 / (distDuzina) < 90 / (distSirina) ? 180 / (distDuzina) : 90 / (distSirina);
                if (singletonCheck == null) {
                    setDefaultZoom(Math.log2(maxDist) + 2);
                    setSingletonCheck(false);
                }

                //console.log("default zoom set", maxDist);
                //console.log("defaultCenter set")
            }
        } else if (myLocation != null && locationAccess === true) {
            let pom = [];
            if (friends !== null && groupMembers !== null && nearUsers !== null && sharers != null) {
                pom = FriendsGroup();
                // console.log("Called FREIND GROUP2");
                for (let i = 0; i < nearUsers.length; i++) {
                    let found = false;
                    for (let j = 0; j < pom.length; j++) {
                        if (pom[j].id == nearUsers[i].id) {
                            found = true;
                            pom[j].isNear = true;
                        }
                    }
                    if (!found) {
                        pom.push({ ...nearUsers[i], isUser: false, isInSameGroup: false, isFriend: false, isNear: true, isShared: false });
                        // setOtherUsersData((prev) => {
                        //     console.log("just added one 4");

                        //     return [...prev, { ...nearUsers[i], isUser: false, isInSameGroup: false, isFriend: false, isNear: true, isShared: false }];
                        // })
                    }
                }

                for (let i = 0; i < sharers.length; i++) {
                    let found = false;
                    for (let j = 0; j < pom.length; j++) {
                        if (sharers[i].id === pom[j].id) {
                            found = true;
                            pom[j].isShared = true;
                        }
                    }
                    if (!found) {
                        pom.push({ ...sharers[i], isUser: false, isInSameGroup: false, isFriend: false, isNear: false, isShared: true });
                    }
                }
            }

            setOtherUsersData((prev) => {
                return [...pom];
            })

            if (singletonCheck == null) {
                setDefaultCenter({ lat: Number(myLocation.lat), lng: Number(myLocation.lng) })
                setDefaultZoom(13);
                setCurrentCenter({ lat: Number(myLocation.lat), lng: Number(myLocation.lng) });
                setSingletonCheck(false);
            } else {
                setCurrentCenter({ lat: Number(myLocation.lat), lng: Number(myLocation.lng) });
            }
        }
        //  console.log("dz",defaultZoom);
        // console.log("dc",defaultCenter);
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [userId, myLocation, friends, groupMembers, sharers])

    const condition = userId != null && myLocation != null || (friends != null && groupMembers != null);
    const conditionContent = defaultCenter != null && defaultZoom != null && locationAccess != null;
    return (
        <>
            {loading && (
                <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-50 w-32 h-32 bg-gray-500 opacity-70 rounded-md">
                    <div className="flex flex-col justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            <>
                {condition && <MapHeader otherUsersData={otherUsersData} setSelectedUserIndex={setSelectedUserIndex} userId={userId}
                    friends={friends} groupMembers={groupMembers} myLocation={myLocation} defaultCenter={defaultCenter}
                    setSearchClicked={setSearchClicked} />}


                {conditionContent && <MapMainContent defaultCenter={defaultCenter} defaultZoom={defaultZoom} userId={userId} myLocation={myLocation} nearUsers={nearUsers} friends={friends}
                    groupMembers={groupMembers} otherUsersData={otherUsersData} setOtherUsersData={setOtherUsersData}
                    selectedUserIndex={selectedUserIndex} resetLocation={() => { setSelectedUserIndex(null); }} setSelectedUserIndex={setSelectedUserIndex} currentCenter={currentCenter}
                    searchClicked={searchClicked} setSearchClicked={setSearchClicked}
                />}
            </>
        </>
    );

}