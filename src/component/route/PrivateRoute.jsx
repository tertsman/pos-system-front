// // src/component/route/PrivateRoute.jsx
// import { Navigate } from "react-router-dom";
// // import getAccessToken from "../../Store/server.Store";
// import {  getProfile } from "../../Store/profile.store";
// import { getAccessToken } from "../../Store/profile.store";

// const PrivateRoute = ({ children, requiredPermission }) => {
//   const token = getAccessToken();
//   const profile = getProfile();

//   if (!token || !profile) {
//     return <Navigate to="/login" replace />;
//   }

//   // បើត្រូវការ Permission Check
//   if (requiredPermission) {
//     const userPermissions = profile.permission || [];
//     const hasPermission = userPermissions.includes(requiredPermission);

//     if (!hasPermission) {
//       return <Navigate to="/403" replace />;
//     }
//   }

//   return children;
// };

// export default PrivateRoute;


import React from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../../Store/profile.store";

const PrivateRoute = ({ children }) => {
  const token = getAccessToken();

  if (!token) {
    // បើមិនមាន token → បញ្ជូនទៅ login
    return <Navigate to="/login" replace />;
  }

  // ប្រសិនបើមាន token → បង្ហាញ component ដើម
  return children;
};

export default PrivateRoute;
