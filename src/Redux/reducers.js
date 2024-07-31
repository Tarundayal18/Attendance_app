import { SET_LOGGED_IN } from "./constant";
import { SET_USER_DATA } from "./constant";
import { SET_EDIT_DATA } from "./constant";

const initialState = {
  userData: { 
    isLogin: false,
    user: null
  },

  checkedIn: false,
};

export function reducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_USER_DATA:
      // const ss={
      //   ...state,
      //   userData: action.payload,
      // };
      // console.log(ss);
      return {
        ...state,
        userData: action.payload,
      };
    case SET_EDIT_DATA:
      const dd = {
        ...state,
        userData: {
          ...state.userData,
          user: action.payload,
        }
      }
      console.log("asdfghjkl",dd);
      return {
        ...state,
        userData: {
          ...state.userData,
          user: action.payload,
        }

      };
    default:
      return state;
  }
};



// import { SET_LOGGED_IN, SET_USER_DATA, SET_CHECK_IN } from "./constant";

// const initialState = {
//   userData: {
//     isLogin: false,
//     user: null
//   },
//   checkedIn: false,
// };

// export function reducer(state = initialState, action) {
//   const { type, payload } = action;
//   switch (type) {
//     case SET_USER_DATA:
//       return {
//         ...state,
//         userData: {
//           ...state.userData,
//           ...payload,
//         },
//       };
//     case SET_CHECK_IN:
//       return {
//         ...state,
//         checkedIn: payload, // Update checkedIn status with payload
//       };
//     default:
//       return state;
//   }
// }

