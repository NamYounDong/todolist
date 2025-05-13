// 연/월 선택
const selectCalendarDte = (date, todoListJson) => {
    if(date == undefined || date == ''){
        date = new Date();
    }

    document.querySelector("#year").value = date.getFullYear();
    moveMonthIdx = date.getMonth();
    
    moveMonth(0, todoListJson); // 월 표기 이벤트
}


// 월 표기 이벤트
var moveMonthIdx = 0; // 월 표기 인덱스
const moveMonth = (move, todoListJson) => {
    const monthListWrap = document.querySelector("#monthListWrap");
    const year = document.querySelector("#year");
    
    // move가 0인 경우 moveMonthIdx만 조정하여 이벤트 진행

    if(move > 0){ // 다음달
        moveMonthIdx ++;
    }else if(move < 0){ // 이전달
        moveMonthIdx --;
    }
    
    if(moveMonthIdx < 0){
        moveMonthIdx  = 11;
        year.value = Number(year.value)  - 1;
    }else if(moveMonthIdx > 11){
        moveMonthIdx  = 0;
        year.value = Number(year.value)  + 1;
    }

    let moveLeft = `calc(${moveMonthIdx * -100}% - ${(13 * (moveMonthIdx))+(moveMonthIdx == 0 ? 0 : 1)}px)`;
    monthListWrap.style.left = moveLeft;

    const monthList = document.querySelectorAll("#monthListWrap li");
    monthList.forEach(el => {
        el.classList.remove('selected');
    });
    monthList[moveMonthIdx].classList.add('selected');

    createCalendar(todoListJson); // calendar 생성
}


const createCalendar = (todoListJson) => {
    const nowDte = new Date().format('yyyy-MM-dd');
    const year = document.querySelector("#year").value;
    const month =  document.querySelector("#monthListWrap .selected").textContent;
    
    // 1일의 요일 0 부터 '일' 월화수목금토
    const fstDay = new Date(`${year}-${month}-01`).getDay();
    
    // 현월 마지막 일자
    const lastDte = new Date(year, month, 0).getDate();

    // 전월 마지막 일자
    const prevDte = new Date(`${year}-${month}`);
    prevDte.setMonth(prevDte.getMonth()-1);
    // getMonth() 는 0부터 시작이기 때문에 +1 처리
    const prevLastDte = new Date(prevDte.getFullYear(), prevDte.getMonth()+1, 0).getDate(); 

    // 익월 마지막 일자
    const nxtDte = new Date(`${year}-${month}`);
    nxtDte.setMonth(nxtDte.getMonth()+1);


    let calendarTableTag = '<tr>';
    const calendarTable = document.querySelector('#calendarTable tbody');
    
    const dayCnt =  Math.ceil((lastDte + fstDay) / 7) * 7; // 현 월 일자 반영 셀 칸 카운팅

    if(todoListJson == undefined || todoListJson == ''){
        todoListJson = JSON.parse(localStorage.getItem('todoListJson')); // TodoList JSON 조회
    }

    for (let i = 0; i < dayCnt; i++) { // 1개월을 7일 5주 35일로 간주
        const cellDte = i - fstDay + 1; // 현재 셀에 출력할 날짜

        if(i < fstDay){ // 전 월 마지막 일자 까지
            const prevMonthDte = prevLastDte - (fstDay - 1) + i;
            const prevMonthCellDte = new Date(`${prevDte.getFullYear()}-${prevDte.getMonth()+1}-${pad(prevMonthDte, 2)}`).format('yyyy-MM-dd'); 

            calendarTableTag += calendarTableTrTag(prevMonthCellDte, prevMonthDte, todoListJson, nowDte);

        }else if(lastDte >= cellDte){ // 마지막 일자와 현재 셀에 출력할 날짜가 같아질 때 까지
            
            // 현재 셀 연월일
            const nowCellDte = new Date(`${year}-${month}-${pad(cellDte, 2)}`).format('yyyy-MM-dd'); 
            
            calendarTableTag += calendarTableTrTag(nowCellDte, cellDte, todoListJson, nowDte);

        }else{ // 익 월 셀 남으면 입력
            const nxtMonthDte = cellDte - lastDte;
            const nxtMonthCellDte = new Date(`${nxtDte.getFullYear()}-${nxtDte.getMonth()+1}-${pad(nxtMonthDte, 2)}`).format('yyyy-MM-dd'); 
            
            calendarTableTag += calendarTableTrTag(nxtMonthCellDte, nxtMonthDte, todoListJson, nowDte);

        }

        if(i != 1 && i % 7 == 6){
            calendarTableTag += '</tr>';
        }
    }

    calendarTable.replaceChildren();
    calendarTable.insertAdjacentHTML('beforeend', calendarTableTag);




    document.querySelectorAll('.todo_wrap').forEach((el) => {
        el.addEventListener('mouseover', (event) => {
            // 화면 넓이, 높이
            const screenW = document.querySelector('.main_wrap').clientWidth;
            const screenH = window.innerHeight;
            // 현재 마우스 위치
            const clientX = event.clientX;
            const clientY = event.clientY;
            // mouseover 된 태그 넓이, 높이
            const elWidth = el.clientWidth;
            const elHeight = el.clientHeight;
            // mouseover 된 태그 hover로 노출되는 태크 넓이, 높이
            const elCntnWidth = el.querySelector('.todo_calendar_cntn').clientWidth;
            const elCntnHeight = el.querySelector('.todo_calendar_cntn').clientHeight;

            if(clientX+elCntnWidth > screenW){
                el.querySelector('.todo_calendar_cntn').style.left = (-1 * (elCntnWidth - (screenW - clientX))) + "px";
            }

            if(clientY+elCntnHeight+40 > screenH){
                el.querySelector('.todo_calendar_cntn').style.bottom = (elHeight + 5) + "px";
            }
        });
    })
    
}


// calendar Tr td 태그 생성 
const calendarTableTrTag = (cellDte, dte, todoListJson, nowDte) => {
    let calendarTodoTdTag = '';
    let todoTag = '';

    const month =  Number(document.querySelector("#monthListWrap .selected").textContent); 

    todoListJson.forEach((todoJson) => {
        const todoSDte = new Date(todoJson.sDte).format('yyyy-MM-dd');
        const todoFDte = new Date(todoJson.fDte).format('yyyy-MM-dd');

        // 시작일 >= 현재 셀 연월일 <= 마감일
        if(cellDte >= todoSDte && cellDte <= todoFDte){  
            todoTag += `<div class="todo_wrap">
                <div${cellDte >= nowDte ? '' : ' class="op05"'}>${todoJson.tit}</div>
                <div class="todo_calendar_cntn">
                    <div${cellDte >= nowDte ? '' : ' class="op05"'}>${todoJson.cntn.replaceAll('\n', '<br>')}</div>
                </div>
            </div>`;
        }
    })

    calendarTodoTdTag += `<td>
                            <div class="cell_wrap">
                                <div class="cell_dte${cellDte ==  nowDte ? ' txt-bold' : ''}${month == cellDte.split('-')[1] ? '' : ' op05'}">${dte}</div>
                                <div class="cell_todo">
                                    ${todoTag}
                                </div>
                            </div>
                        </td>`;

    return calendarTodoTdTag;
}