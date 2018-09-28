// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import $ from 'jquery';
import {
  HOME_SEARCH,
  HOME_SEARCH_PROXY,
} from './constants';

// const serverAddress = 'https://13.230.197.82';
const serverAddress = '../..';

export function search(callback) {
  return (dispatch) => {
    dispatch(searchProxy((flag1, result1)=>{
      if(!flag1&&result1.code === 401){
        dispatch(setTeams([]));
        callback&&callback({flag1, flag2: false, result1, result2: {}, reLogin: true});
      } else {
        dispatch(searchTeams((flag2, result2)=>{
          callback&&callback({flag1, flag2, result1, result2});
        }));
      }
    }));
  }
}

export function searchTeams(callback){
  return (dispatch, getState) => {
    var state = getState();
    $.ajax({
      url : serverAddress + '/vppn/api/v1/client/searchTeam',
      type: 'POST',
      contentType: "application/json", //必须有
      dataType: 'json', //表示返回值类型
      beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("ApiKey", "0cde13b523sf9aa5a403dc9f5661344b91d77609f70952eb488f31641");
        XMLHttpRequest.setRequestHeader("Authorization", state.home.loginInfo.Authorization);
      },
      data: JSON.stringify({"userId": state.home.loginInfo.userInfo.username}),
      async : true,
      success : (res)=>{
        dispatch(setTeams(res.teams));
        callback&&callback(true, res);
      },
      error : (error)=>{
        dispatch(setTeams([]));
        callback&&callback(false, error);
      }
    });
  }
}

export function searchProxy(callback){
  return (dispatch, getState) => {
    var state = getState();
    $.ajax({
      url : serverAddress + '/vppn/api/v1/proxy/getproxy',
      type: 'GET',
      contentType: "application/json", //必须有
      dataType: 'json', //表示返回值类型
      beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("ApiKey", "0cde13b523sf9aa5a403dc9f5661344b91d77609f70952eb488f31641");
        XMLHttpRequest.setRequestHeader("Authorization", state.home.loginInfo.Authorization);
      },
      async : true,
      success : (res)=>{
        if(res.code===200){
          dispatch(setProxy(res.proxy));
          callback&&callback(true, res);
        } else {
          dispatch(setProxy([]));
          callback&&callback(false, res);
        }
      },
      error : (error)=>{
        dispatch(setProxy([]));
        callback&&callback(false, error);
      }
    });
  }
}

export function setTeams(teams){
  return {
    type: HOME_SEARCH,
    teams
  };
}

export function setProxy(proxys){
  return {
    type: HOME_SEARCH_PROXY,
    proxys
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SEARCH:
      return {
        ...state,
        teams: action.teams
      };
    case HOME_SEARCH_PROXY:
      return {
        ...state,
        proxys: action.proxys
      };
    default:
      return state;
  }
}
