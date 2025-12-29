// src/service/scheduleApi/eventMappers.js

/**
 * Firestore 문서(data + docId)를 FullCalendar 이벤트로 변환
 * - FullCalendar 표준: { id, title, start, end, backgroundColor, borderColor, extendedProps }
 */
export function mapDocToFcEvent(docId, data, columnNames) {
  const id = data[columnNames.no] || docId;
  const color = data[columnNames.color] || "#2563eb";

  return {
    id,
    title: data[columnNames.title] || "(제목없음)",
    start: data[columnNames.start],
    end: data[columnNames.end],
    backgroundColor: color,
    borderColor: color,
    extendedProps: {
      no: id,
      category: data[columnNames.category] || "",
      content: data[columnNames.content] || "",
      color,
    },
  };
}

/**
 * 모달 폼(formData: {title,start,end,category,content,color,no}) → Firestore 저장 payload로 변환
 */
export function mapFormToDbPayload(formData, columnNames) {
  console.log("mapFormToDbPayload formData", formData);
  return {
    [columnNames.title]: formData.SCHEDULE_TITLE,
    [columnNames.start]: formData.SCHEDULE_START,
    [columnNames.end]: formData.SCHEDULE_END,
    [columnNames.category]: formData.SCHEDULE_STATUS,
    [columnNames.content]: formData.SCHEDULE_CONTENT,
    [columnNames.color]: formData.COLOR || "#2563eb",
    // no는 문서 id로 관리하므로 create에선 보통 넣지 않음(업데이트는 docId로 찾음)
  };
}
