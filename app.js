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

    // todo list 태그 생성
    createTodoListTag(todoListJson);
    
    document.querySelector("#submitBtn").addEventListener("click", () => {
        var tit = document.querySelector("[name=tit]").value;
        console.log("tit : "+tit);

        if(tit.trim() == ""){ // 제목 미입력 체크
            alert("제목을 입력해주세요.");
            return;
        }

        regTodo();
    });
}


function regTodo(){
    const todoForm = document.querySelector("#todoForm")
    const formData = new FormData(todoForm);

    var todo = {
        dte : new Date().format("yyyy-MM-dd hh:mm:ss") // 등록일시 생성 및 날짜 포맷
    }

    // 입력 정보 JSON 처리
    for (const [key, value] of formData.entries()){
        todo[key] = value;
    }

    var todoListJson = JSON.parse(localStorage.getItem('todoListJson'));
    if(todoListJson == "" || todoListJson == undefined){
        todoListJson = []
    }

    todoListJson.unshift(todo); // todolist 배열에 입력정보 추가
    localStorage.setItem('todoListJson',JSON.stringify(todoListJson)) // 로컬스토리지에 json string 저장

    // todo list 태그 생성
    createTodoListTag(todoListJson);

    // 입력정보(form정보) 리셋
    todoForm.reset();
}

// todo list 태그 생성 함수
var createTodoListTag = (todoListJson) => { // 차후 검색/페이징 처리 기능을 위해 todoListJson은 별도로 전달
    if(todoListJson == "" || todoListJson == undefined){ // 스토리지에 데이터 없는 경우
        var noToDoListTag = '<tr><td class="txt_center" colspan="4">ToDo List가 없습니다.</td></tr>';
        document.querySelector("#todoListTable tbody").innerHTML = noToDoListTag;
    }else{ // 스토리지에 데이터가 있는 경우
        var toDoListTag = "";
        todoListJson.forEach((todoJson, idx) => {
            toDoListTag += "<tr>";
            toDoListTag +=   "<td>"+todoJson.tit+"</td>";
            toDoListTag +=   "<td>"+todoJson.cntn.replaceAll("\n", "<br/>")+"</td>";
            toDoListTag +=   '<td class="txt_center">'+todoJson.dte+'</td>';
            toDoListTag +=   '<td class="txt_center"><button class="del" onclick="removeTodo(this, '+idx+')"/>삭제</button></td>';
            toDoListTag += "</tr>";
        });
        document.querySelector("#todoListTable tbody").innerHTML = ""; // 테이블 태그 리셋
        document.querySelector("#todoListTable tbody").innerHTML = toDoListTag; // Json 리스트 태그로 노출
    }
}

// todo list 라인 제거
var removeTodo = function(tag, idx){
    var todoListJson = JSON.parse(localStorage.getItem('todoListJson')); // JSON 조회
    todoListJson.splice(idx, 1); // 해당 index todolist 제거
    localStorage.setItem('todoListJson', JSON.stringify(todoListJson)) // 로컬스토리지에 json string 저장

    createTodoListTag(todoListJson);
}