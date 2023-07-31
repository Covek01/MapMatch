// myLocation : {lat: int, lon: int}
// otherUsersInfo: Array<{lat: int, long: int, name: str, isFriend: bool}>
// selectedUserIndex: ?int 
// resetLocation: () => void

import React, { Children, useEffect, useState } from "react";
import PinComponent from "./PinComponent";
import GoogleMapReact from 'google-map-react';
import { useSnackbar } from "Context/SnackbarContext/SnackbarContext";
import { MyLocation, Pin } from "@mui/icons-material";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { useRef } from "react";
import { lsGetUser } from "utils/localStorage";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useGoogleLogin } from "@react-oauth/google";
import { MapContainer, Marker, TileLayer, useMapEvents, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import UserService from "Services/UserService";
import axios from "axios";
import randomColor from "randomcolor";
import styled from "styled-components"
import Button from '@mui/material/Button'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FriendshipService from "Services/FriendshipService";
import RequestService from "Services/RequestService";
import SendFriendRequestButton from "./SendFriendRequestButton";
import SendShareRequestButton from "./SendShareRequestButton";

export default function MapMainContent({ defaultCenter, defaultZoom, userId, myLocation, nearUsers, friends, groupMembers, otherUsersData,
  setOtherUsersData,
  selectedUserIndex, resetLocation, setSelectedUserIndex, currentCenter, searchClicked, setSearchClicked }) {
  const [userData, setUserData] = useState(null);//({username:"",picture:"",profileStatus:"",})
  const [selectedUser, setSelectedUser] = useState(null);

  const [userIcon, setUserIcon] = useState(null);
  const [otherIcons, setOtherIcons] = useState(null);

  const [friendColor, setFriendColor] = useState(null);
  const [groupIdColor, setGroupIdColor] = useState([]);
  const [nearColor, setNearColor] = useState(null);
  const [sharedColor, setSharedColor] = useState(null);
  const [groupIdsList, setGroupIdsList] = useState([]);
  const [otherUsersDataColors, setOtherUsersDataColor] = useState(null);

  //const [otherUsersData, setOtherUsersData] = useState([]);//([{userName:"",picture:"",profileStatus:"",isFriend:false,areInGroup:false,groupNames:[]}])  
  // const [defaultCenter, setDefaultCenter] = useState(null);
  // const [defaultZoom, setDefaultZoom] = useState(null);
  // const mapOptions = {
  //   // Set clickableIcons option to false
  //   clickableIcons: false,
  //   fullscreenControl: false
  // };

  const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#314f4d',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#dadcda',
      },
    },
  })
  // console.log("drugi users :", otherUsersData);
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    if (selectedUserIndex === -1) {
      //openSnackbar({ message: "Korisnik sa datim username-om nije na mapi", severity: "info" });
    } else {
      for (let i = 0; i < otherUsersData.length; i++) {
        if (otherUsersData[i].id == selectedUserIndex) {
          panTo(otherUsersData[i].latitude, otherUsersData[i].longitude, 15);
        }
      }
    }

  }, [selectedUserIndex, searchClicked]);


  useEffect(() => {
    let pom=[];
    let numOfColors=4+groupIdsList.length;
    
    setSharedColor(`hsl(${1*360/numOfColors},85%,65%)`);
    setNearColor(`hsl(${2*360/numOfColors},85%,65%)`);
    setFriendColor(`hsl(${3*360/numOfColors},85%,65%)`);
    for(let i=0;i<groupIdsList.length;i++){
      pom={...pom,[groupIdsList[i]]:`hsl(${(i+4)*360/numOfColors},85%,65%)`}
    }
    //console.log("OBICNE BOJE SET");
    setGroupIdColor(pom);

  }, [groupIdsList]);

  useEffect(() => {

    if (otherUsersData !== null && otherUsersData.length !== 0) {
      let pom = [];
      let groupPom = [];
      for (let i = 0; i < otherUsersData.length; i++) {
        if (otherUsersData[i].groupIds != null) {
          for (let j = 0; j < otherUsersData[i].groupIds.length; j++) {
            pom = { ...pom, [otherUsersData[i].groupIds[j]]: randomColor() }
            let alreadyThere = false;
            for (let iter = 0; iter < groupPom.length; iter++) {
              if (groupPom[iter] == otherUsersData[i].groupIds[j]) {
                alreadyThere = true;
              }
            }
            if (!alreadyThere) {
              groupPom.push(otherUsersData[i].groupIds[j])
            }
          }
        }
      }
      setGroupIdColor(pom);
      setGroupIdsList(groupPom);
      //console.log("GROUP ID COLOR SETT", pom);
    }
    // console.log(otherUsersDataColors, "OVO SU LJDUI SA BOJAMAAA");
  }, [otherUsersData])

  useEffect(() => {
    const getMyInfo = async () => {
      try {
        const { data, status } = await UserService.getMyInfo();
        if (status == 200) {
          setUserData({ ...data, isUser: true })
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.message);
        }
      }
    }
    getMyInfo();
  }, []);

  useEffect(() =>{
    const cleanOldRequests = async () =>{
      const myid = UserService.getMyId()
      try{
        await RequestService.CleanAllOldFriendRequests()
      }
      catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.message);
        }
    }
  }

  cleanOldRequests()

}, [])

  useEffect(() => {

    let changedUsers = [];
    if (otherUsersData != null && otherUsersData.length != 0) {
      for (let j = 0; j < otherUsersData.length; j++) {
        const cols = [];
        changedUsers.push(otherUsersData[j]);
        if (friendColor != null && otherUsersData[j].isFriend) {
          cols.push(friendColor);
        }
        if (nearColor != null && otherUsersData[j].isNear) {
          cols.push(nearColor);
        }
        if (sharedColor != null && otherUsersData[j].isShared) {
          cols.push(sharedColor);
        }
        if (otherUsersData[j] != null) {
          if (otherUsersData[j].isInSameGroup) {
            for (let i = 0; i < otherUsersData[j].groupIds.length; i++) {
              cols.push(groupIdColor[otherUsersData[j].groupIds[i]]);
              console.log("IMPORTANT IMPORTANT IMPORTATN", groupIdColor[0]);
            }
          }
        }
        // changedUser = { ...changedUser, colors: cols }
        changedUsers[j] = { ...changedUsers[j], color: cols }
      }

    }
    // console.log("CHANGED USERS", changedUsers);
    setOtherUsersDataColor(
      //   return [...prev, { ...otherUsersData[j], colors: cols }]
      //otherUsersData.map(u =>  changedUsers.filter(c=>c.id==u.id)!=null ? { ...changedUsers.filter(c=>c.id==u.id) } : u)
      changedUsers
    )
    //console.log("BOJEEE", friendColor,nearColor,groupIdColor);
    // console.log("BOJE SE MENJAJU");

  }, [friendColor, nearColor, groupIdColor, sharedColor])

  // function FriendsGroup() {
  //   for (let i = 0; i < friends.length; i++) {
  //     let found = false;
  //     for (let j = 0; j < groupMembers.length; j++) {
  //       if (friends[i].id == groupMembers[j].id) {
  //         setOtherUsersData(prev => {
  //           return [...prev, { ...groupMembers[j], isInSameGroup: true, isFriend: true }];
  //         })
  //         found = true;
  //       }
  //     }
  //     if (!found) {
  //       setOtherUsersData(prev => {
  //         return [...prev, { ...friends[i], isInSameGroup: false, isFriend: true }];
  //       })
  //     }
  //   }



  //   for (let j = 0; j < groupMembers.length; j++) {
  //     let found = false;
  //     for (let k = 0; k < otherUsersData.length; k++) {
  //       if (groupMembers[j].id == otherUsersData[k].id) {
  //         found = true
  //       }
  //     }
  //     if (!found) {
  //       setOtherUsersData(prev => {
  //         return [...prev, { ...groupMembers[j], isInSameGroup: true, isFriend: false }];
  //       })
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (selectedUserIndex === -1) {
  //     openSnackbar({ message: "Ne postoji korisnik sa datim username-om", severity: "info" });
  //   } else {
  //     console.log(selectedUserIndex);
  //   }

  // }, [selectedUserIndex]);


  // useEffect(() => {
  //   if (myLocation == null || userId == null) {
  //     if (friends !== null && groupMembers !== null) {
  //       FriendsGroup();

  //       let defaultCenterPom = { lat: 0, lng: 0 };
  //       let maxE = -180, maxW = 180, maxN = -90, maxS = 90;
  //       for (let i = 0; i < otherUsersData.length; i++) {
  //         defaultCenterPom.lat += Number(otherUsersData[i].latitude);
  //         defaultCenterPom.lng += Number(otherUsersData[i].longitude);
  //         if (otherUsersData[i].longitude > maxE) maxE = otherUsersData[i].longitude;
  //         if (otherUsersData[i].longitude < maxW) maxW = otherUsersData[i].longitude;
  //         if (otherUsersData[i].latitude > maxN) maxN = otherUsersData[i].longitude;
  //         if (otherUsersData[i].latitude < maxS) maxS = otherUsersData[i].longitude;


  //       }
  //       defaultCenterPom.lat /= otherUsersData.length == 0 ? 1 : otherUsersData.length;
  //       defaultCenterPom.lng /= otherUsersData.length == 0 ? 1 : otherUsersData.length;
  //       console.log("Check lat lng ", defaultCenterPom.lat, defaultCenterPom.lng);
  //       setDefaultCenter({ lat: defaultCenterPom.lat, lng: defaultCenterPom.lng });
  //       let maxDist = maxE - maxW > maxN - maxS ? maxE - maxW : maxN - maxS;
  //       setDefaultZoom(180 / maxDist);
  //       console.log("default zoom set", maxDist);
  //       console.log("defaultCenter set")
  //     }
  //   } else {

  //     if (friends !== null && groupMembers !== null && nearUsers !== null) {
  //       FriendsGroup();


  //       for (let i = 0; i < nearUsers.length; i++) {
  //         let found = false;
  //         for (let j = 0; j < groupMembers.length; j++) {
  //           if (groupMembers[j].id == nearUsers[i].id) {
  //             found = true;
  //           }
  //         }
  //         if (!found) {
  //           setOtherUsersData((prev) => {
  //             return [...prev, { ...nearUsers[i], isInSameGroup: false, isFriend: false }];
  //           })
  //         }
  //       }
  //     }


  //     setDefaultCenter({ lat: Number(myLocation.lat), lng: Number(myLocation.lng) })
  //     setDefaultZoom(10);
  //   }

  // }, [userId, myLocation, nearUsers, friends, groupMembers, selectedUserIndex])


  // if (myLocation == null) {
  //   return <>Loading...</>;
  // }


  // const apiIsLoaded = (map, maps, lat, lng) => {
  //   if (map) {
  //     const latLng = new maps.LatLng(lat, lng); // Makes a latlng
  //     map.panTo(latLng);
  //   }
  // };


  const sendFriendRequest = async (user) => {
    const myid = (await UserService.getMyId()).data
    await RequestService.InsertFriendRequestsByIds(myid, user.id)
  }

  const mapRef = useRef(null);


  // const handleApiLoaded = (map) => {
  //   mapRef.current = map;
  // }

  const panTo = (lat, lng, zoom) => {
    // if (mapRef.current) {
    //   mapRef.current.panTo({ lat, lng })
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], zoom);
    }
  }


  // const setZoom = (zoom) => {
  //   if (mapRef.current) {
  //     mapRef.current.setZoom(zoom);
  //   }
  // }

  // console.log(otherUsersInfo);
  // TODO dugme za re-centriranje, poziva resetLocation()
  // const defaultProps = {
  //   center: {
  //     lat: 51.7559867,
  //     lng: -1.269996
  //   },
  //   zoom: 20
  // };

  function handleRecenter() {
    if (myLocation != null) {
      let currentZoom = mapRef.current.getZoom();
      if (currentZoom < 13)
        currentZoom = 13;
      panTo(myLocation.lat, myLocation.lng, currentZoom);

    }
    else {
      panTo(currentCenter.lat, currentCenter.lng, defaultZoom);
    }
  }

  //console.log(selectedUserIndex == null ? myLocation : { lat: otherUsersInfo[selectedUserIndex].lat, lng: otherUsersInfo[selectedUserIndex].lng });
  // console.log(defaultProps.center);
  const condition = myLocation != null || (friends != null && groupMembers != null);


  const homeIcon = L.icon({
    iconUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ4a29WDF60a7lU7vL-dY4g8jqrBFK7q8zEn_KYSocjeXMFKvee_5GZhBJ8z5R0clUS_0&usqp=CAU",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [-3, -76],
  });

  useEffect(() => {
    if (userData != null) {
      const iconMarkup = renderToStaticMarkup(<div><PinComponent friendColor={friendColor} nearColor={nearColor} groupIdColor={groupIdColor}
        sharedColor={sharedColor} userToDraw={userData} /></div>);
      const customMarkerIcon = divIcon({
        html: iconMarkup,
      });
      setUserIcon(customMarkerIcon);
    }
  }, [userData]);

  useEffect(() => {
    if (otherUsersDataColors != null) {
      const pom = [];
      for (let i = 0; i < otherUsersDataColors.length; i++) {
        const iconMarkup = renderToStaticMarkup(<div><PinComponent friendColor={friendColor} nearColor={nearColor} groupIdColor={groupIdColor}
          sharedColor={sharedColor} userToDraw={otherUsersDataColors[i]} /></div>);
        const customMarkerIcon = divIcon({
          html: iconMarkup
        });
        pom.push(customMarkerIcon);
      }
      setOtherIcons(pom);
    }
  }, [otherUsersDataColors])


  const drawUserCondition = myLocation && userData && userIcon;
  const drawOtherUsersCondition = otherUsersData != null && otherIcons && otherIcons.length != 0;
  return (

    // Important! Always set the container height explicitly
    <div style={{ height: 'calc(100vh - 48px)', width: '100%', background: 'yellow', }}>
      <button onClick={handleRecenter} className="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4  shadow-md shadow-gray-600 rounded absolute z-50 top-1/10 right-4">
        ReCenter
      </button>
      <MapContainer ref={mapRef} className="h-full w-full z-10" center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true}>
       
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {drawUserCondition && <Marker riseOnHover
          position={[myLocation.lat, myLocation.lng]} icon={userIcon} >
          <Popup >Vi ste ovde</Popup>
        </Marker>}

        {drawOtherUsersCondition && otherUsersData.map((user, index) => {
          return <Marker riseOnHover
            position={[user.latitude, user.longitude]} icon={otherIcons[index]} key={user.id}>
            <Popup><div className="flex flex-col w-44">
              <img src={user.profilePhoto} alt={user.username} style={{ widt: `100px` }} />
              <span>Username: {user.username}</span>
              <span>Status: {user.status}</span>
              {user.isInSameGroup &&
                (<span>Mutual groups: {user.groupNames.map((u, index) => {
                  if (index === 0) return `${u}`;
                  return `, ${u}`
                })}</span>)
              }
              {!user.isFriend && user.isNear && (<ThemeProvider theme={theme}>
                <div className="pt-2">
                  <SendFriendRequestButton user={user} />
                </div>
              </ThemeProvider>
              )}
              {user.isFriend && (<div className="h-10 text-sm">
                <ThemeProvider theme={theme}>
                  <div className="pt-2">
                    {/* <Button variant="contained"
                      color="primary"
                    >Share Location</Button> */}
                    <SendShareRequestButton user={user} senderId={userId}/>
                    </div>
                </ThemeProvider></div>

              )}
            </div></Popup>
          </Marker>
        })}
      </MapContainer>

    </div >


  );
}