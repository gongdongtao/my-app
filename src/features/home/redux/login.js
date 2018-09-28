// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import $ from 'jquery';
import Base64 from '../../common/script/base64';
import {
  HOME_LOGIN,
} from './constants';

export function login(userInfo, callback) {
  return dispatch => {
    $.ajax({
      // url : 'https://13.230.197.82/mqtt/auth',
      // url: 'https://54.200.5.57/mqtt/auth',
      url : '../../mqtt/auth',
      type: 'POST',
      contentType: "application/json", //必须有
      dataType: 'json', //表示返回值类型
      beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("ApiKey", "0cde13b523sf9aa5a403dc9f5661344b91d77609f70952eb488f31641");
      },
      data: JSON.stringify(
        {
          "clientid": userInfo.clientid, 
          "username": userInfo.username, 
          "password": userInfo.password
        }
       ),
      async : true,
      success : (res)=>{
        res.userInfo = userInfo;
        res.Authorization = Base64.base64encode(userInfo.username+':'+userInfo.clientid);
        // console.log(res.Authorization);
        dispatch(setLoginInfo(res));
        callback&&callback(true, res);
      },
      error : (error)=>{
        console.log(error);
        callback&&callback(false, error);
      }
    });
  }
  
}

function setLoginInfo(loginInfo){
  return {
    type: HOME_LOGIN,
    loginInfo
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_LOGIN:
      return {
        ...state,
        loginInfo: action.loginInfo
      };

    default:
      return state;
  }
}
