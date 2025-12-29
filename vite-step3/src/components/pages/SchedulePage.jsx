import React, { useEffect, useState } from 'react'
import Header from '../include/Header'
import Footer from '../include/Footer'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timelinePlugin from '@fullcalendar/timeline'
import './schedule.css'
import ScheduleCalendar from '../schedule/ScheduleCalendar'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCalendarEvents, setAtEvents, setFilteredEvents } from '../../redux/calendarAtSlice'
import { scheduleColumn } from '../../service/scheduleApi/scheduleColumn'
import { addDB, deleteDB, subscribeDB, updateDB } from '../../service/scheduleApi/scheduleLogic'
import { mapFormToDbPayload } from '../../service/scheduleApi/eventMappers'
const SchedulePage = () => {
  const dispatch = useDispatch() // useDispatch hook으로 dispatch 함수 얻기
  const [weekendsVisible, setWeekendsVisible] = useState(true);// 주말 표시 여부 상태 추가
  const [selectedCategory, setSelectedCategory] = useState('');
  // Redux state
  const events = useSelector((state) => state.calendarAtSlice.events);
  const filteredEvents = useSelector((state) => state.calendarAtSlice.filteredEvents); //필터 데이터 가져오기
  
  useEffect(() => {
    dispatch(fetchCalendarEvents()); // ✅ Firestore -> setAtEvents -> setFilteredEvents까지 동기화
  }, [dispatch]);

  // ✅ Firestore 실시간 구독 → Redux 동기화
  useEffect(() => {
    console.log("SchedulePage useEffect");
    if (!scheduleColumn) return;
    console.log("Firestore 실시간 구독 → Redux 동기화");
    const unsub = subscribeDB(scheduleColumn, (fcEvents) => {
      console.log("SchedulePage useEffect subscribeDB fcEvents", fcEvents);
      dispatch(setAtEvents(fcEvents));      // ✅ 원본 events 최신화
      dispatch(setFilteredEvents());        // ✅ 현재 filters 기준 filteredEvents 최신화
    });

    return () => unsub?.();
  }, [dispatch, scheduleColumn]);

  // ✅ 생성
  const onCreate = async (formData) => {
    console.log("SchedulePage onCreate formData", formData);
    const payload = mapFormToDbPayload(formData, scheduleColumn);
    console.log("SchedulePage onCreate payload", payload);
    await addDB(payload);
    dispatch(fetchCalendarEvents()); // ✅ Firestore -> setAtEvents -> setFilteredEvents까지 동기화
  };

  // ✅ 수정: event.id 또는 formData.no를 docId로 사용
  const onUpdate = async (formData) => {
    console.log("SchedulePage onUpdate formData", formData);
    const scheduleNo = formData.SCHEDULE_NO // 모달이 어떤 키로 주는지에 대비
    console.log("SchedulePage onUpdate scheduleNo", scheduleNo);
    const payload = mapFormToDbPayload(formData, scheduleColumn);
    console.log("SchedulePage onUpdate payload", payload);
    await updateDB(scheduleNo, payload);
  };

  // ✅ 삭제
  const onDelete = async (formData) => {
    console.log("SchedulePage onDelete formData", formData);
    const scheduleNo = formData.SCHEDULE_NO;
    console.log("SchedulePage onDelete scheduleNo", scheduleNo);
    await deleteDB(scheduleNo);
  };

  return (
    <>
      <Header />
      <main className="container-fluid p-0">
        <ScheduleCalendar 
          weekendsVisible={weekendsVisible}
          events={filteredEvents?.length ? filteredEvents : events}
          selectedCategory={selectedCategory}
          filteredEvents={filteredEvents} //title로 필터 검색을 사용한다면 사용
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </main>
      <Footer />
    </>
  )
}

export default SchedulePage