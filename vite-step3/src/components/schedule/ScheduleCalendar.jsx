import React from 'react'
import CommonCalendar from '../fullcalendar/CommonCalendar'
const ScheduleCalendar = ({weekendsVisible, filteredEvents, onCreate, onUpdate, onDelete}) => {
  console.log("ScheduleCalendar");
  //스프링 컨트롤러 url 입력(기본 CRUD)
  const commonUrls = {
      listURL: null,
      addURL: null,
      updateURL: null,
      deleteURL: null,
  };

  return (
    <>
      <CommonCalendar
        urls={commonUrls}
        weekendsVisible={weekendsVisible}
        filteredEvents={filteredEvents}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  )
}

export default ScheduleCalendar