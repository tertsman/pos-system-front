// profile.store.js
export const setProfile = (profile) => {
  
    
    return  localStorage.setItem("profile", profile); // Save profile
  
};

export const getProfile = () => {
   try{

     var profile = localStorage.getItem("profile");
     if (profile !== "" && profile !==null && profile !== undefined){

       return profile= JSON.parse(profile);
     }
   }catch(err){
    return null
   }
    
};





export const setAccessToken = (token) => {
     return localStorage.setItem("access_token", token); // Save the token to localStorage
    
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token"); // Retrieve the token from localStorage
};





export const setPermission = (array) => {
  
    
    return  localStorage.setItem("permission", array); // Save profile
  
};

export const getPermission = () => {
   try{

     var permission = localStorage.getItem("permission");
     if (permission !== "" && permission !==null && permission !== undefined){

       return permission= JSON.parse(permission);
     }
   }catch(err){
    return null
   }
    
};