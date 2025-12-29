import { createSlice } from "@reduxjs/toolkit";
import { listDB } from "../service/scheduleApi/scheduleLogic";

// Redux Toolkit의 createSlice로 slice(상태 + 리듀서 + 액션)를 한 번에 생성
const calendarAtSlice = createSlice({ //
    name: "calendarAtSlice", // slice이름(액션타입 prefix가 됨)
    initialState: {
        events: [], //Firestore에서 가져온 전체 일정 목록 원본
        filteredEvents: [], // 검색/카테고리 필터가 적용된 결과 목록
        filters: {
            searchTitle: "", //제목 검색어
            selectedCategory: "", //선택된 카테고리 
        },
    },
    // 상태를 변경하는 '동기' 리듀서 함수들
    reducers: {
        // 전체 일정 저장
        // DB에서 일정 목록 가져온 후 dispatch(setAtEvents(events)) 형태로 사용
        setAtEvents: (state, action) => {
            console.log("calendarAtSlice setAtEvents:", action.payload);
            // action.payload = 일정배열(예: [{title: "일정1", start: "2025-01-01", end: "2025-01-02", category: "work"}, ...])
            state.events = action.payload;
        },
        // 필터 저장
        // 검색창 입력 / 카테고리 선택 변경시 dispatch(setFilters({...})) 로 호출
        setFilters: (state, action) => {
            // action.payload = {searchTitle: "회의", selectedCategory: "work"} 형식
            state.filters = action.payload;
        },
        // 필터 적용 결과 계산
        // 현재 state.events와 state.filters 값을 이용해서 필터링
        // 계산 결과를 state.filteredEvents에 저장
        setFilteredEvents: (state, action) => {
            // state에서 원본 이벤트와 필터 값 꺼내기
            const { events, filters } = state;
            //events배열을 filters 조건으로 걸러낸 결과 만들기
            const filteredData = events.filter((event) => {
                //제목 검색 필터
                //searchTitle이 비어있으면(=필터 미적용) 무조건 true
                //값이 있으면 event.title에 포함되어야 true
                const isSearchMatch = !filters.searchTitle || event.title.includes(filters.searchTitle);
                //카테고리 필터
                //selectedCategory가 비어있으면(=필터 미적용) 무조건 true
                //값이 있으면 event.category와 일치해야 true
                const isCategoryMatch = !filters.selectedCategory || event.category === filters.selectedCategory;
                //두 필터 조건 모두 만족해야 true
                return isSearchMatch && isCategoryMatch;
            });
            // 필터링 결과를 state.filteredEvents에 저장(달력에 이 배열을 내려줌)
            state.filteredEvents = filteredData;
        },
    },
});

// ✅ createSlice가 자동으로 만들어준 action creators 꺼내기
export const { setAtEvents, setFilters, setFilteredEvents } = calendarAtSlice.actions;

/**
 * ✅ Firestore 조회 결과를 setAtEvents에 동기화해서 넣는 Thunk
 * - listDB()로 rows 가져오기
 * - events 저장
 * - 현재 filters 기준으로 filteredEvents도 즉시 재계산
 */
export const fetchCalendarEvents = () => async (dispatch) => {
    try {
      const rows = await listDB();      // ✅ Firestore 조회
      dispatch(setAtEvents(rows));      // ✅ store.events 갱신
      dispatch(setFilteredEvents());    // ✅ store.filteredEvents 동기화 갱신
    } catch (err) {
      console.error("fetchCalendarEvents failed:", err);
    }
  };
  
  /**
   * ✅ 필터 변경도 “동기화”되게 하는 Thunk (권장)
   * - filters 저장
   * - filteredEvents 즉시 재계산
   */
  export const applyCalendarFilters = (filters) => (dispatch) => {
    dispatch(setFilters(filters));
    dispatch(setFilteredEvents());
  };
// ✅ slice의 reducer를 기본 export (store에 등록할 때 사용)
export default calendarAtSlice.reducer;
