import {SET_LOGGED_IN} from "./constant";
import {SET_USER_DATA} from "./constant";
import {SET_EDIT_DATA} from "./constant";

// export const setLoggedIn = (isLoggedIn) => ({
//   type: SET_LOGGED_IN,
//   payload: isLoggedIn,
// }); 

export const setUserData = (userData) => ({
  type: SET_USER_DATA,
  payload: userData,
});

export const setEditData = (userData) => ({
  type: SET_EDIT_DATA,
  payload: userData,
}); 