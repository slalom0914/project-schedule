import { combineReducers, configureStore } from "@reduxjs/toolkit";
import calendarAtSlice from "./calendarAtSlice";


//리듀서 목록을 아래에 관리함. persistReducer 처리하지 않은 리듀서들은 로컬스토리지에서 관리되지 않음
const rootReducer = combineReducers({  //지연 캘린더
  calendarAtSlice:calendarAtSlice, //슬기 캘린더
});

const store = configureStore({
  reducer:   rootReducer,
  
});

export default store;