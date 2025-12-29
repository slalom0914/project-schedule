import React, { useState } from 'react'
import Header from '../include/Header'
import Footer from '../include/Footer'
import AtCalendar from '../admin/AtCalendar'
import { useSelector } from 'react-redux'
import { setAtEvents, setFilters } from '../../redux/calendarAtSlice'
const AtCalendarPage = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);// 주말 표시 여부 상태 추가
  const [selectedCategory, setSelectedCategory] = useState('');
  const handleDispatch = (events)=>dispatch(setAtEvents(events)); //이벤트 리덕스 스토어 저장
  const eventData = useSelector((state)=> state.calendarAtSlice.events); //이벤트 데이터 가져오기
  const filteredEvents = useSelector((state) => state.calendarAtSlice.filteredEvents); //필터 데이터 가져오기
  return (
    <>
      <Header />
      <main className="container-fluid p-0">
          <AtCalendar 
            weekendsVisible={weekendsVisible}
            eventData={eventData}
            selectedCategory={selectedCategory}
            handleDispatch={handleDispatch}
            filteredEvents={filteredEvents} //title로 필터 검색을 사용한다면 사용
          />
      </main>
      <Footer />
    </>
  )
}

export default AtCalendarPage