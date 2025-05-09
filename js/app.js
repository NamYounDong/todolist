// JSON.parse
// JSON.stringify
// const json = '{"result":true, "count":42}';
// console.log(JSON.parse(json));
// localStorage 가져오기: localStorage.getItem('key');
// localStorage 저장하기: localStorage.setItem('key', 'value');
// document.createElement('tag name'): 태그 생성

// 기능
// 1. input 창에 할일 입력 후 추가 버튼 클릭 또는 엔터
// 2. 할일 목록 로컬 스토리지에 저장
// 3. 로컬 스토리지 데이터 화면에 렌더링
// 4. 추가된 할일 데이터를 바탕으로 DOM 요소 추가
// 5. 삭제 버튼 클릭 시 삭제 기능 실행
// 6. 완료 버튼 클릭 시 데이터 DOM 이동 기능 실행

window.onload = function(){
    let todoListJson = JSON.parse(localStorage.getItem('todoListJson'));

    // 입력정보(form정보) 리셋
    resetTodoForm();

    // todo list 태그 생성
    createTodoListTag(todoListJson);

    document.querySelector("#submitBtn").addEventListener("click", () => {
        regeTodoProc();
    });

    document.querySelector("#modifyBtn").addEventListener("click", () => {
        regeTodoProc();
    });
}

// Todo List 동작
function regeTodoProc(){
    if(!chkFormData()){ // 데이터 등록 유효성 검사
        return;
    }
    regTodo(); // 등록 / 수정 함수
}


// 데이터 등록 유효성 검사
function chkFormData(){
    let chk = true;
    let tit = document.querySelector("[name=tit]");
    if(tit.value.trim() == ""){ // 제목 미입력 체크
        
        tit.value = "";
        tit.classList.add('no_txt');
        setTimeout(() => {
            tit.classList.remove('no_txt');
        }, 5000);

        chk = false;
    }

    return chk;
}


// 등록 / 수정 함수
function regTodo(){
    let todoForm = document.querySelector("#todoForm")
    let formData = new FormData(todoForm);

    let todo = {
        regDte : new Date().format("yyyy-MM-dd hh:mm") // 등록일시 생성 및 날짜 포맷
    }

    // 입력 정보 JSON 처리
    for (const [key, value] of formData.entries()){
        todo[key] = value;
    }

    let trgtIdx = document.querySelector('#modifyIdx').value;
    let todoListJson = JSON.parse(localStorage.getItem('todoListJson'));

    if(trgtIdx == "-1"){ // 등록
        if(todoListJson == "" || todoListJson == undefined){
            todoListJson = []
        }
    
        todoListJson.unshift(todo); // todolist 배열에 입력정보 추가
    }else{ // 수정
        todoListJson[trgtIdx] = todo; // 대상 todo 정보 교체
    }

    localStorage.setItem('todoListJson',JSON.stringify(todoListJson)) // 로컬스토리지에 json string 저장

    // todo list 태그 생성
    createTodoListTag(todoListJson);

    // 입력정보(form정보) 리셋
    resetTodoForm();
}

// todo list 태그 생성 함수
const createTodoListTag = (todoListJson) => { // 차후 검색/페이징 처리 기능을 위해 todoListJson은 별도로 전달
    if(todoListJson == "" || todoListJson == undefined){ // 스토리지에 데이터 없는 경우
        let noToDoListTag = '<tr><td class="txt_center" colspan="4">ToDo List가 없습니다.</td></tr>';
        document.querySelector("#todoListTable tbody").innerHTML = noToDoListTag;
    }else{ // 스토리지에 데이터가 있는 경우
        let toDoListTag = "";
        todoListJson.forEach((todoJson, idx) => {
            toDoListTag += `<tr>`;
            toDoListTag +=   `<td>${todoJson.tit}</td>`;
            toDoListTag +=   `<td>`;
            toDoListTag +=      `<div class="cntn_td_wrap">`;
            toDoListTag +=          `<div class="todo_cntn">${todoJson.cntn.replaceAll("\n", "<br/>")}</div>`;
            toDoListTag +=          `<div class="reg_dte">등록일시:${todoJson.regDte}</div>`;
            toDoListTag +=      `</div>`;
            toDoListTag +=   `</td>`;
            toDoListTag +=   `<td class="txt_center">`
            toDoListTag +=      `<p>${todoJson.sDte}</p><p>~</p><p>${todoJson.fDte}</p>`;
            toDoListTag +=   `</td>`;
            toDoListTag +=   `<td class="txt_center">`;
            toDoListTag +=      `<div>`;
            toDoListTag +=          `<button class="modify" onclick="modifyTodoFormSettting(this, ${idx})"/>수정</button>`;
            toDoListTag +=          `<button class="del" onclick="removeTodo(this, ${idx})"/>삭제</button>`;
            toDoListTag +=      `</div>`;
            toDoListTag +=   `</td>`;
            toDoListTag += `</tr>`;
        });
        document.querySelector("#todoListTable tbody").replaceChildren(); // 테이블 태그 리셋
        document.querySelector("#todoListTable tbody").insertAdjacentHTML('beforeend', toDoListTag); // Json 리스트 태그로 노출
    }

    // calendar 현재 날짜 지정 및 생성
    selectCalendarDte();
}


const openSubmitForm = () => {
    const todoForm = document.querySelector('#todoForm');
    if(!todoForm.classList.contains('active')){
        todoForm.classList.add('active');
    }
    document.querySelector('#openTodoFormOpenBtn').style.display = 'none';
    document.querySelector('#openTodoFormCloseBtn').style.display = 'block';

}

const closeSubmitForm = () => {
    const todoForm = document.querySelector('#todoForm');
    if(todoForm.classList.contains('active')){
        todoForm.classList.remove('active');
    }
    document.querySelector('#openTodoFormOpenBtn').style.display = 'block';
    document.querySelector('#openTodoFormCloseBtn').style.display = 'none';
}

// todo list 라인 수정
const modifyTodoFormSettting = function(tag, idx){
    openSubmitForm();

    let todoListJson = JSON.parse(localStorage.getItem('todoListJson'))[idx]; // todoList JSON 대상 정보 조회

    tag.parentNode.parentNode.parentNode.classList.add('selected'); // 수정 대상 선택 처리
    // todoList 테이블 모든 버튼 비활성화 처리
    document.querySelectorAll('#todoListTable button').forEach(element => {
        element.classList.add('disabled');
        element.disabled = true;
    });

    document.querySelector('#openTodoFormOpenBtn').disabled = true;
    document.querySelector('#openTodoFormCloseBtn').disabled = true;
    document.querySelector('#openTodoFormOpenBtn').classList.add('disabled');
    document.querySelector('#openTodoFormCloseBtn').classList.add('disabled');


    document.querySelector('#modifyIdx').value = idx; // 수정 대상 index값 저장

    document.querySelector('#submitBtn').style.display = 'none'; // 수정 버튼 노출
    document.querySelectorAll('.modify_btns').forEach(element => {
        element.style.display = 'block';
    }); // 수정관련 버튼 노출

    // form 데이터 입히기
    // form에 데이터가 추가되어도 추가 수정이 필요 없도록 유동적으로 key값이 적용되도록 대응
    for (const key of Object.keys(todoListJson)){
        let formTrgt = document.querySelector('#todoForm [name='+key+']')
        if(!(formTrgt == undefined || formTrgt == null)){
            formTrgt.value = todoListJson[key]; 
        }
    }
}


// todo list 라인 제거
const removeTodo = function(tag, idx){
    let todoListJson = JSON.parse(localStorage.getItem('todoListJson')); // JSON 조회
    todoListJson.splice(idx, 1); // 해당 index todolist 제거
    localStorage.setItem('todoListJson', JSON.stringify(todoListJson)) // 로컬스토리지에 json string 저장

    createTodoListTag(todoListJson);
}

// todo 입력 폼 리셋
const resetTodoForm = () => {
    const todoForm = document.querySelector("#todoForm")
    todoForm.reset();
    // 일정 input 초기화
    document.querySelector('[name=sDte]').value = new Date().format('yyyy-MM-dd');
    document.querySelector('[name=fDte]').value = new Date().format('yyyy-MM-dd');

    document.querySelector('#submitBtn').style.display = 'block'; // 등록 버튼 노출
    // 수정관련 버튼 숨김
    document.querySelectorAll('.modify_btns').forEach(element => {
        element.style.display = 'none';
    }); 

    // todoList 테이블 모든 버튼 활성화 처리
    document.querySelectorAll('#todoListTable button').forEach(element => {
        element.classList.remove('disabled');
        element.disabled = false;
    });

    document.querySelector('#openTodoFormOpenBtn').disabled = false;
    document.querySelector('#openTodoFormCloseBtn').disabled = false;
    document.querySelector('#openTodoFormOpenBtn').classList.remove('disabled');
    document.querySelector('#openTodoFormCloseBtn').classList.remove('disabled');


    // 테이블 선택 영역 클래스 제거
    document.querySelectorAll('#todoListTable tbody tr').forEach(element => {
        element.classList.remove('selected');
    });

    document.querySelector('#modifyIdx').value = "-1"; // 수정 대상 제거
}

const searchTodoList = function(){
    let todoListJson = JSON.parse(localStorage.getItem('todoListJson')); // JSON 조회
    
    let searchText = document.querySelector("#searchTxt");
    if(searchTxt.value.trim() == ""){ // 검색어 미입력
        searchText.value = "";
        searchTxt.classList.add('no_txt');
        setTimeout(() => {
            searchTxt.classList.remove('no_txt');
        }, 5000);

        createTodoListTag(todoListJson);
        return;
    }

    let searchTodoList = [];

    todoListJson.forEach((todoJson, idx) => {
        // 공백 무시 문자열 비교 정규식
        const pattern = createWhitespaceInsensitiveRegex(searchText.value.replaceAll(" ", ""));
        
        // 내용 또는 제목에 포함된 텍스트 조회 > 조회된 텍스틑 span .search_trgt_txt 처리
        if(todoJson.cntn.match(pattern) || todoJson.tit.match(pattern)){ 
            todoJson.cntn = todoJson.cntn.replaceAll(pattern, '<span class="search_trgt_txt">$&</span>')
            todoJson.tit = todoJson.tit.replaceAll(pattern, '<span class="search_trgt_txt">$&</span>')
            
            searchTodoList.push(todoJson);
        }
    });
    createTodoListTag(searchTodoList);
}
