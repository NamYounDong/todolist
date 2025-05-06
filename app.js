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
    createTodoListTag();
    
    document.querySelector("#submitBtn").addEventListener("click", () => {
        regTodo();
    });
}


function regTodo(){
    const todoForm = document.querySelector("#todoForm")
    const formData = new FormData(todoForm);

    var todo = {
        dte : new Date().format("yyyy-MM-dd")
    }
    for (const [key, value] of formData.entries()){
        todo[key] = value;
    }

    var todoListJson = JSON.parse(localStorage.getItem('todoListJson'));
    if(todoListJson == "" || todoListJson == undefined){
        todoListJson = []
    }

    todoListJson.push(todo);
    localStorage.setItem('todoListJson',JSON.stringify(todoListJson)) // 로컬스토리지에 json string 저장

    createTodoListTag();

    todoForm.reset();
}

var createTodoListTag = () => {
    var todoListJson = JSON.parse(localStorage.getItem('todoListJson'));
    
    if(todoListJson == "" || todoListJson == undefined){
        var noToDoListTag = '<tr><td class="txt_center" colspan="4">등록된 정보가 없습니다.</td></tr>';
        document.querySelector("#todoListTable tbody").innerHTML = noToDoListTag;
    }else{
        var toDoListTag = "";
        todoListJson.forEach((todoJson, idx) => {
            toDoListTag += "<tr>";
            toDoListTag +=  "<td>"+todoJson.tit+"</td>";
            toDoListTag +=  "<td>"+todoJson.cntn.replaceAll("\n", "<br/>")+"</td>";
            toDoListTag +=  '<td class="txt_center">'+todoJson.dte+'</td>';
            toDoListTag +=  '<td class="txt_center"><button class="del" onclick="removeTodo(this, '+idx+')"/>삭제</button></td>';
            toDoListTag += "</tr>";
        });
        document.querySelector("#todoListTable tbody").innerHTML = ""; // 최초 리셋
        document.querySelector("#todoListTable tbody").innerHTML = toDoListTag; // Json 리스트 등록
    }
}

// todo list 라인 제거
var removeTodo = function(tag, idx){
    var todoListJson = JSON.parse(localStorage.getItem('todoListJson')); // JSON 조회
    todoListJson.splice(idx, 1);
    localStorage.setItem('todoListJson', JSON.stringify(todoListJson)) // 로컬스토리지에 json string 저장
    createTodoListTag();
}