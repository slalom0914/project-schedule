import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import styles from './commonCalendar.module.css';

const CommonCalendarModal = ({action, // "생성" | "수정"
  event, // selectedEvent (FullCalendar Event 또는 {start,end} 객체)
  onCreate, onUpdate, onDelete, onClose, categories, defaultCategories}) => {
  const mergedCategories = defaultCategories?.length ? defaultCategories : categories;
  // 날짜 형식을 변환하는 함수 (Date 객체 또는 ISO 문자열 처리)
  const formatDateForInput = (date) => {
    if (!date) return '';
    // Date 객체인 경우
    if (date instanceof Date) {
      return moment.tz(date, 'Asia/Seoul').format('YYYY-MM-DDTHH:mm');
    }
    // ISO 문자열인 경우
    const momentDate = moment.tz(date, 'Asia/Seoul');
    return momentDate.format('YYYY-MM-DDTHH:mm');
  };
  //입력 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    no: undefined,
    category: '',
    content:''
  });


  // ✅ 핵심: 모달이 열릴 때(또는 event/action이 바뀔 때) 기존 값을 formData로 채우기
  useEffect(() => {
    console.log("CommonCalendarModal useEffect action", action);
    console.log("CommonCalendarModal useEffect event", event);
    console.log("CommonCalendarModal useEffect mergedCategories", mergedCategories);
    // action이 "생성"이면 선택한 날짜값(event.start/end)을 채워주고 나머지 초기화
    if (action === "생성" && event) {
      setFormData({
        no: "",
        title: "",
        start: event.start ? formatDateForInput(event.start) : "",
        end: event.end ? formatDateForInput(event.end) : "",
        category: mergedCategories?.[0] || "",
        content: "",
      });
      return;
    }

    // action이 "수정"이면 FullCalendar Event 객체에서 기존 값을 꺼내서 채움
    if (action === "수정" && event) {
      const ext = event.extendedProps || {};

      setFormData({
        // ✅ no(문서id)는 extendedProps.no가 있으면 그걸 쓰고, 없으면 event.id 사용
        no: ext.no || event.id || "",

        // ✅ 제목은 event.title
        title: event.title || "",

        // ✅ 날짜는 event.start / event.end를 datetime-local 형식으로 변환
        start: event.start ? formatDateForInput(event.start) : "",
        end: event.end ? formatDateForInput(event.end) : "",

        // ✅ 카테고리/내용은 extendedProps에서 꺼냄
        category: ext.category || mergedCategories?.[0] || "",
        content: ext.content || "",
      });
    }
  }, [action, event, mergedCategories]);


    
    //폼 안의 값이 바뀌는 것 처리
    const handleChange = (e) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.value,
      }));
  };

  //저장하기
  const handleSave = () => {
    const confirmAdd = window.confirm("생성하시겠습니까?");
    if(confirmAdd){
      console.log(formData);
      //onSave(formData);
      onCreate(formData);
      onClose();
    }
    onClose();
  };

  //수정하기
  const handleUpdate = () => {
    const confirmUpdate = window.confirm("수정하시겠습니까?");
    if(confirmUpdate){
      console.log("CommonCalendarModal handleUpdate formData", formData);
      onUpdate(formData);
      onClose();
    }
    onClose();
  };
  
  //삭제하기
  const handleDelete = () => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if(confirmDelete){
      onDelete(formData);
      onClose();
    }
    onClose();
  };

  return (
    <>
      <Modal show={true} onHide={onClose} className="modalForm" style={{height:'auto', alignItems:'center', fontSize:'0.5rem'}}>
        <Modal.Header closeButton style={{backgroundColor:'#794ff7', color:'white'}}>
          <Modal.Title style={{fontWeight:'bolder', fontSize:'1rem', height:'auto'}}><FontAwesomeIcon icon={faCalendarDays} />  {action === '생성' ? '새로운 일정 추가' : '기존 일정 수정'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle" style={{marginTop:'10px'}}>
              <Form.Label style={{fontSize:'1rem', fontWeight:'bolder'}}>이름</Form.Label>
              <Form.Control
                  style={{fontSize:'0.8rem'}}
                  type="text"
                  placeholder="내용을 입력하세요"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formContent" style={{marginTop:'10px'}}>
              <Form.Label style={{fontSize:'1rem', fontWeight:'bolder'}}>내용</Form.Label>
              <Form.Control
                  style={{fontSize:'0.8rem', height: '50px' }}
                  as="textarea"
                  rows={1}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategory" style={{marginTop:'10px'}}>
              <Form.Label style={{fontSize:'1rem', fontWeight:'bolder'}}>카테고리</Form.Label>
              <Form.Control
                  style={{fontSize:'0.8rem'}}
                  as="select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
              >
                  <option value="" >카테고리를 선택하세요</option>
                  {defaultCategories ? (
                      defaultCategories.map((category) => (
                          <option key={category} value={category}>
                              {category}
                          </option>
                      ))
                      ) : (
                      //개별 사전설정 카테고리 없을때
                      categories.map((category) => (
                          <option key={category} value={category}>
                              {category}
                          </option>
                      ))
                  )}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStart" style={{marginTop:'10px'}}>
            <Form.Label style={{ fontSize: '1rem', fontWeight: 'bolder', marginRight: '10px' }}>시작 일시</Form.Label>
              <Form.Control
                  style={{fontSize:'0.8rem'}}
                  type="datetime-local"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  />
            </Form.Group>
            <Form.Group controlId="formEnd" style={{marginTop:'10px'}}>
              <Form.Label style={{fontSize:'1rem', fontWeight:'bolder'}}>종료 일시</Form.Label>
              <Form.Control
                  style={{fontSize:'0.8rem'}}
                  type="datetime-local"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  />
            </Form.Group>
            <br/>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{fontWeight:'bolder', fontSize:'0.8rem'}} variant="outline-secondary" onClick={onClose}>
            취소
          </Button>
          <Button style={{fontWeight:'bolder', fontSize:'0.8rem'}} variant="outline-primary"  onClick={action === '생성' ? handleSave : handleUpdate}>
            {action === '생성' ? '저장' : '수정'}
          </Button>
          {action === '수정' && (
          <Button style={{fontWeight:'bolder', fontSize:'0.8rem'}} variant="outline-danger" onClick={handleDelete}>
            삭제
          </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CommonCalendarModal