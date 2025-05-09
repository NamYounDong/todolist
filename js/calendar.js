
// 연/월 선택
const selectCalendarDte = (date) => {
    if(date == undefined || date == ''){
        date = new Date();
    }

    document.querySelector("#year").value = date.getFullYear();
    moveMonthIdx = date.getMonth();
    
    moveMonth(0); // 월 표기 이벤트
}


// 월 표기 이벤트
var moveMonthIdx = 0; // 월 표기 인덱스
const moveMonth = (move) => {
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

    createCalendar(); // calendar 생성
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
    prevDte.setMonth(prevDte.getMonth());
    const prevLastDte = new Date(prevDte.getFullYear(), prevDte.getMonth(), 0).getDate();
    
    let calendarTableTag = '<tr>';
    const calendarTable = document.querySelector('#calendarTable tbody');
    
    const dayCnt =  Math.ceil((lastDte + fstDay) / 7) * 7; // 현 월 일자 반영 셀 칸 카운팅

    console.log(todoListJson);
    todoListJson = JSON.parse(localStorage.getItem('todoListJson')); // TodoList JSON 조회

    for (let i = 0; i < dayCnt; i++) { // 1개월을 7일 5주 35일로 간주
        const cellDte = i - fstDay + 1; // 현재 셀에 출력할 날짜

        if(i < fstDay){ // 전 월 마지막 일자 까지
            calendarTableTag += `<td class="op05">${prevLastDte - (fstDay - 1) + i}</td>`;
        }else if(lastDte >= cellDte){ // 마지막 일자와 현재 셀에 출력할 날짜가 같아질 때 까지
            
            // 현재 셀 연월일
            const nowCellDte = new Date(`${year}-${month}-${pad(cellDte, 2)}`).format('yyyy-MM-dd'); 
            
            let todoTag = '';
            todoListJson.forEach((todoJson) => {
                const todoSDte = new Date(todoJson.sDte).format('yyyy-MM-dd');
                const todoFDte = new Date(todoJson.fDte).format('yyyy-MM-dd');

                // 시작일 >= 현재 셀 연월일 <= 마감일
                if(nowCellDte >= todoSDte && nowCellDte <= todoFDte){  
                    todoTag += `<div class="todo_wrap${nowCellDte >= nowDte ? '' : ' op05'}">${todoJson.tit}</div>`;
                }
            })
            calendarTableTag += `<td>
                                    <div class="cell_wrap">
                                        <div class="cell_dte${nowCellDte == nowDte ? ' txt-bold' : ''}">${cellDte}</div>
                                        <div class="cell_todo">
                                            ${todoTag}
                                        </div>
                                    </div>
                                </td>`;

        }else{ // 익 월 셀 남으면 입력
            calendarTableTag += `<td class="op05">${cellDte - lastDte}</td>`;
        }

        if(i != 1 && i % 7 == 6){
            calendarTableTag += '</tr>';
        }
    }

    calendarTable.replaceChildren();
    calendarTable.insertAdjacentHTML('beforeend', calendarTableTag);
}