import { Outlet, Navigate, Route } from "react-router-dom";
import React from "react";
import { useAuthContext } from "Context/AuthContext/AuthContext";

const PrivateRoutes = () => {
    const {isAuthenticated}= useAuthContext();
    return(
        isAuthenticated() ? <Outlet/> : <Navigate to="/login"/>
    );
}
 export default PrivateRoutes;

 //---ne znam kako da uzmem exp date sa jwtDecode, moram  vidim da li da radim onda uopste to 
// const PrivateRoutes = () => {
//     const token = localStorage.getItem("token");
  
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000;
  
//         if (decodedToken.exp < currentTime) {
//           // Token has expired, logout the user and navigate to login page
//           localStorage.removeItem("token");
//           return <Navigate to="/login" />;
//         } else {
//           // Token is valid, render the protected routes
//           return <Outlet />;
//         }
//       } catch (error) {
//         // Invalid token, logout the user and navigate to login page
//         localStorage.removeItem("token");
//         return <Navigate to="/login" />;
//       }
//     } else {
//       // No token found, navigate to login page
//       return <Navigate to="/login" />;
//     }
//   };
  
//   export default PrivateRoutes;