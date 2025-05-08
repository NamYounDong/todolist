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
    console.log("====== Todo List Start ======");
    
    var todoListJson = JSON.parse(localStorage.getItem('todoListJson'));
    
    console.log("====== Todo List JSON ======");
    console.log(todoListJson);

    // 입력정보(form정보) 리셋
    resetTodoForm();

    // todo list 태그 생성
    createTodoListTag(todoListJson);
    
    document.querySelector("#submitBtn").addEventListener("click", () => {
        if(chkFormData()){ // 데이터 등록 유효성 검사
            return;
        }
        regTodo(); // 등록 / 수정 함수
    });


    document.querySelector("#modifyBtn").addEventListener("click", () => {
        if(chkFormData()){ // 데이터 등록 유효성 검사
            return;
        }
        regTodo(); // 등록 / 수정 함수
    });
}

// 데이터 등록 유효성 검사
function chkFormData(){
    var chk = true;
    var tit = document.querySelector("[name=tit]").value;
    if(tit.trim() == ""){ // 제목 미입력 체크
        alert("제목을 입력해주세요.");
    }

    return chk;
}


// 등록 / 수정 함수
function regTodo(){
    const todoForm = document.querySelector("#todoForm")
    const formData = new FormData(todoForm);

    var todo = {
        regDte : new Date().format("yyyy-MM-dd hh:mm") // 등록일시 생성 및 날짜 포맷
    }

    // 입력 정보 JSON 처리
    for (const [key, value] of formData.entries()){
        todo[key] = value;
    }

    var trgtIdx = document.querySelector('#modifyIdx').value;
    var todoListJson = JSON.parse(localStorage.getItem('todoListJson'));
    
    if(trgtIdx == "-1"){ // 등록
        if(todoListJson == "" || todoListJson == undefined){
            todoListJson = []
        }
    
        todoListJson.unshift(todo); // todolist 배열에 입력정보 추가
    }else{ // 수정
        var trgtIdx = document.querySelector('#modifyIdx').value;
        todoListJson[trgtIdx] = todo; // 대상 todo 정보 교체
    }

    localStorage.setItem('todoListJson',JSON.stringify(todoListJson)) // 로컬스토리지에 json string 저장

    // todo list 태그 생성
    createTodoListTag(todoListJson);

    // 입력정보(form정보) 리셋
    resetTodoForm();
}

// todo list 태그 생성 함수
var createTodoListTag = (todoListJson) => { // 차후 검색/페이징 처리 기능을 위해 todoListJson은 별도로 전달
    if(todoListJson == "" || todoListJson == undefined){ // 스토리지에 데이터 없는 경우
        var noToDoListTag = '<tr><td class="txt_center" colspan="4">ToDo List가 없습니다.</td></tr>';
        document.querySelector("#todoListTable tbody").innerHTML = noToDoListTag;
    }else{ // 스토리지에 데이터가 있는 경우
        var toDoListTag = "";
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
            toDoListTag +=      `<p>${todoJson.sDte}</p><p>~</p><p>${todoJson.fDte}</p>`
            toDoListTag +=   `</td>`;
            toDoListTag +=   `<td class="txt_center">`;
            toDoListTag +=      `<div>`;
            toDoListTag +=          `<button class="modify" onclick="modifyTodoFormSettting(this, '+idx+')"/>수정</button>`;
            toDoListTag +=          `<button class="del" onclick="removeTodo(this, ${idx})"/>삭제</button>`;
            toDoListTag +=      `</div>`;
            toDoListTag +=   `</td>`;
            toDoListTag += `</tr>`;
        });
        document.querySelector("#todoListTable tbody").insertAdjacentHTML('beforeend', ''); // 테이블 태그 리셋
        document.querySelector("#todoListTable tbody").insertAdjacentHTML('beforeend', toDoListTag); // Json 리스트 태그로 노출
    }
}

// todo list 라인 수정
var modifyTodoFormSettting = function(tag, idx){
    var todoListJson = JSON.parse(localStorage.getItem('todoListJson'))[idx]; // todoList JSON 대상 정보 조회

    tag.parentNode.parentNode.parentNode.classList.add('selected'); // 수정 대상 선택 처리
    // todoList 테이블 모든 버튼 비활성화 처리
    document.querySelectorAll('#todoListTable button').forEach(element => {
        element.classList.add('disabled');
        element.disabled = true;
    });

    document.querySelector('#modifyIdx').value = idx; // 수정 대상 index값 저장

    document.querySelector('#submitBtn').style.display = 'none'; // 수정 버튼 노출
    document.querySelectorAll('.modify_btns').forEach(element => {
        element.style.display = 'block';
    }); // 수정관련 버튼 노출

    // form 데이터 입히기
    // form에 데이터가 추가되어도 추가 수정이 필요 없도록 유동적으로 key값이 적용되도록 대응
    for (const key of Object.keys(todoListJson)){
        var formTrgt = document.querySelector('#todoForm [name='+key+']')
        if(!(formTrgt == undefined || formTrgt == null)){
            formTrgt.value = todoListJson[key]; 
        }
    }
}


// todo list 라인 제거
var removeTodo = function(tag, idx){
    var todoListJson = JSON.parse(localStorage.getItem('todoListJson')); // JSON 조회
    todoListJson.splice(idx, 1); // 해당 index todolist 제거
    localStorage.setItem('todoListJson', JSON.stringify(todoListJson)) // 로컬스토리지에 json string 저장

    createTodoListTag(todoListJson);
}

// todo 입력 폼 리셋
var resetTodoForm = () => {
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

    // 테이블 선택 영역 클래스 제거
    document.querySelectorAll('#todoListTable tbody tr').forEach(element => {
        element.classList.remove('selected');
    });

    document.querySelector('#modifyIdx').value = "-1"; // 수정 대상 제거
    
}

