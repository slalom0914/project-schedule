// CommonCalendarLogic.js (Firestore 버전)
import app from "../../service/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { mapDocToFcEvent } from "./eventMappers";

const db = getFirestore(app);

// ✅ 컬럼명(요청하신 것과 동일)
const columnNames = {
  no: "SCHEDULE_NO",
  title: "SCHEDULE_TITLE",
  start: "SCHEDULE_START",
  end: "SCHEDULE_END",
  color: "COLOR",
  category: "SCHEDULE_STATUS",
  content: "SCHEDULE_CONTENT",
};

/**
 * ✅ 실시간 구독(onSnapshot) - DB 변경 자동 반영
 * callback(events) 형태
 */
export const subscribeDB = (columnNames, callback) => {
  const q = query(collection(db, "schedules"), orderBy(columnNames.start, "asc"));
  const unsub = onSnapshot(q, (snap) => {
    const events = snap.docs.map((d) => mapDocToFcEvent(d.id, d.data(), columnNames));
    callback(events);
  });
  return unsub;
}

// ✅ 조회 (1회 조회: 기존 CommonCalendar.jsx와 호환)
export const listDB = async () => {
  console.log("scheduleLogic listDB");
  const q = query(
    collection(db, "schedules"),
    orderBy(columnNames.start, "asc")
  );

  const snap = await getDocs(q);

  const rows = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: data[columnNames.no] || d.id,                 // FullCalendar용 id
      title: data[columnNames.title] || "",
      start: data[columnNames.start],
      end: data[columnNames.end],
      no: data[columnNames.no] || d.id,                 // 내부 PK
      color: data[columnNames.color] || "#2563eb",
      content: data[columnNames.content] || "",
      category: data[columnNames.category] || "",
    };
  });

  return rows;
};

// ✅ 추가
export const addDB = async (event) => {
  console.log("scheduleLogic addDB event", event);
  // event는 transformedData (컬럼명 적용된 객체)라고 가정 :contentReference[oaicite:2]{index=2}
  const docRef = await addDoc(collection(db, "schedules"), event);

  // 문서 id를 SCHEDULE_NO에 기록(merge)
  await setDoc(
    doc(db, "schedules", docRef.id),
    { [columnNames.no]: docRef.id },
    { merge: true }
  );

  return docRef.id;
};

// ✅ 수정
export const updateDB = async (scheduleNo, event) => {
  console.log("scheduleLogic updateDB event", event);
  if (!scheduleNo) throw new Error("updateDB: SCHEDULE_NO(no)가 없습니다.");
  const ref = doc(db, "schedules", scheduleNo);
  // PK는 제외하고 업데이트
  const payload = { ...event };
  delete payload[columnNames.no];
  delete payload.no;
  await updateDoc(ref, payload);
};

// ✅ 삭제
export const deleteDB = async (scheduleNo) => {
  console.log("scheduleLogic deleteDB scheduleNo", scheduleNo);
  if (!scheduleNo) throw new Error("deleteDB: SCHEDULE_NO(no)가 없습니다.");
  await deleteDoc(doc(db, "schedules", scheduleNo));
};


export { columnNames };
