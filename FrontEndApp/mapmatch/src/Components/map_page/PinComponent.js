import React, { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { Wrapper } from "@googlemaps/react-wrapper";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { hover } from "@testing-library/user-event/dist/hover";
import zIndex from "@mui/material/styles/zIndex";

//import OverlayView from 'google-map-react';

export default function PinComponent({sharedColor, friendColor, nearColor, groupIdColor,
  userToDraw }) {

   

   
 
  // const [pos, setPos] = useState(null);



  // //treba da se doda i propery za boju koji na osnovu is friend stavlja plavu ili neku drugu
  // //  MyOverlay.prototype=new google.maps.OverlayView();
  // // const markerRef = useRef();
  // // const rootRef = useRef();

  // // useEffect(() => {
  // //   if (!rootRef.current) {
  // //     const container=document.createElement("div");
  // //     rootRef.current=createRoot(container);

  // //     markerRef.current=new google.maps.marker.AdnacedMarkerView({

  // //     })
  // //   }
  // // },[]);


  // const homeIcon = L.icon({
  //   iconUrl:
  //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ4a29WDF60a7lU7vL-dY4g8jqrBFK7q8zEn_KYSocjeXMFKvee_5GZhBJ8z5R0clUS_0&usqp=CAU",
  //   iconSize: [50, 50],
  //   iconAnchor: [25, 50],
  //   popupAnchor: [-3, -76],
  // });

  // useEffect(() => {
  //   if (userToDraw.isUser) {

  //     setPos({lat:userToDraw.Latitude, lng:userToDraw.Longitude});
  //   } else {
  //     setPos({lat:userToDraw.latitude,lng: userToDraw.longitude});
  //   }
  // }, [userToDraw]);


  // // style={{
  // //   color: 'white',
  // //   background: 'red',
  // //   padding: '10px',
  // //   display: 'flex',
  // //   alignItems: 'center',
  // //   justifyContent: 'center',
  // //   borderRadius: '100%',
  // //   width: '30px', // Adjust width as needed
  // //   height: '30px', // Adjust height as needed
  // // }}

  // //  {/* <div
  // //         style={{
  // //           color: 'white',
  // //           background: 'red',
  // //           padding: '10px',
  // //           display: 'flex',
  // //           alignItems: 'center',
  // //           justifyContent: 'center',
  // //           borderRadius: '100%',
  // //           width: '30px', // Adjust width as needed
  // //           height: '30px', // Adjust height as needed
  // //         }}
  // //       > */}
  // //     {/* <img
  // //           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ4a29WDF60a7lU7vL-dY4g8jqrBFK7q8zEn_KYSocjeXMFKvee_5GZhBJ8z5R0clUS_0&usqp=CAU"
  // //           alt={userToDraw.isUser ? userToDraw.UserName : userToDraw.username}
  // //           style={{ width: '100%', height: '100%', borderRadius: '90%' }}
  // //         /> */}
  // //     {/* </div> */}
  // const customMarkerIcon=divIcon({

  // });
  function handleEnter(){
   // console.log("MOUSE ENTERED WOOOO");
  }
  const colors=userToDraw.isUser?['hsl(0,85%,65%)','hsl(0,85%,65%)']:(userToDraw.color.length==1?[userToDraw.color,userToDraw.color]:userToDraw.color);
  const condition=colors.length!=0;
 // console.log("USER TO DRAW IS:", userToDraw);
  return (
    <div 
   
    className="pinComponent "
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        
      }}
    >

     {condition&& <>
      <div
      
        className="z-10 hover:z-50"
        style={{
          color: 'white',
          background: `linear-gradient(to top right,${[...colors]})` ,
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '100%',
          width: '40px', // Adjust width as needed
          height: '40px', // Adjust height as needed
        }}
      >
        <img
         
          src={userToDraw.profilePhoto}
          alt={userToDraw.username}
          style={{ width: '100%', height: '100%', borderRadius: '90%' }}
        />
      </div>
      <div
        style={{
          marginTop: '5px',
          background: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
        }}
      >
        {userToDraw.username}
      </div>
        </>}
    </div>
  );
}