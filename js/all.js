// 選取元素、宣告
const selectLocation = document.querySelector('.select-location');
let travelDataArr = JSON.parse(localStorage.getItem('travelData'));
let list = document.querySelector('.list');
let trendingDistrict = document.querySelector('.navbar-trending ul');
let areaDataArr = JSON.parse(localStorage.getItem('areaData'));
const paginationList = document.querySelector('.pagination');
const paginationNav = document.querySelector('.pagination-gruop');
let areaList = [];

// 拿旅遊景點資料
function getTravelData() {
  // 產生一個 XMLHttpRequest
  const request = new XMLHttpRequest();
  // 當 request 拿到結果（文檔載入完成）時會觸發 onload 事件，執行此 function
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const response = request.responseText;
      const json = JSON.parse(response);
      let travelData = json.data.XML_Head.Infos.Info;
      localStorage.setItem('travelData', JSON.stringify(travelData));
      travelDataArr = JSON.parse(localStorage.getItem('travelData'));
      addAreaData(travelDataArr);
      showAreaData(travelDataArr);
      showTravelData(travelDataArr);
    }
  };
  request.onerror = () => {
    console.log('error');
    alert('系統不穩定，請再試一次');
  };
  // 指定發送 request 的方式、網址、是否為非同步
  request.open('GET', 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c', true);
  // 發送 request
  request.send();
}
getTravelData();

// 將不重複的行政區資料加入 area 陣列中
function addAreaData(travelData) {
  let areaStr = '';
  let areaDataArr = [];
  for (let i = 0; i < travelData.length; i++) {
    let endStr = travelData[i].Add.indexOf('區');
    areaStr = (travelData[i].Add).slice(6, endStr + 1);
    areaList.push(areaStr);
    areaList.forEach((value) => {
      if (areaDataArr.indexOf(value) === -1) {
        areaDataArr.push(value);
      }
    })
  }
  localStorage.setItem('areaData', JSON.stringify(areaDataArr));
}
// 將行政區加入 .select-location 下拉選單
function showAreaData() {
  let areaDataArr = JSON.parse(localStorage.getItem('areaData'));
  for (let i = 0; i < areaDataArr.length; i++) {
    let element = document.createElement('option');
    element.value = areaDataArr[i];
    element.textContent = areaDataArr[i];
    selectLocation.appendChild(element);
  }
}
// 改變 select 選項 (change)時，出現特定行政區景點
selectLocation.addEventListener('change',function () {
  selectDistrict(travelDataArr);
});
// 點擊熱門行政區時，出現特定行政區景點
trendingDistrict.addEventListener('click', function (e){
  e.preventDefault();
  console.log(e.target.nodeName);
  if (e.target.nodeName === 'A') {
    clickDistrict(travelDataArr,e.target);
  }
}
);

// 選擇特定行政區，將資料顯示
function selectDistrict(travelData) {
  let districtValue = selectLocation.value;
  console.log(districtValue);
  if (districtValue === '') {
    list.innerHTML = '';
    // pagination(travelData);
    showTravelData(travelData);
  } else {
    list.innerHTML = '';
    selectLocation.querySelector(`option[value=""]`).disabled = true;
    // pagination(travelData,districtValue);
    showTravelData(travelData,districtValue);
  };
}
// 點擊熱門行政區
function clickDistrict(travelData,target) {
  let districtValue = target.innerText;
  console.log(districtValue);
  if (districtValue === '') {
    list.innerHTML = '';
    // pagination(travelData);
    showTravelData(districtArr);
  } else {
    list.innerHTML = '';
    document.querySelector('.title').innerText = districtValue;
    selectLocation.querySelector(`option[value=""]`).disabled = true;
    selectLocation.querySelector(`option[value=${districtValue}]`).selected = true;
    // pagination(travelData,districtValue);
    showTravelData(travelData,districtValue);
  };
}

// 將特定行政區景點顯示在畫面上
function showTravelData(travelData,districtValue,nowPage) {
  let districtArr = [];
  let districtStr;
  console.log(districtValue);
  if (districtValue === undefined) {
    districtArr = travelData;
  } else {
    document.querySelector('.title').innerText = districtValue;
    for(let i = 0; i < travelData.length; i += 1) {
      if (travelData[i].Add.includes(districtValue)) {
        districtArr.push(travelData[i]);
      };
    };
  }
  console.log(districtArr);
  pagination(districtArr,nowPage);
  // 點擊分頁
  paginationNav.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') return;
    console.log(e);
    const page = e.target.dataset.page;
    console.log(page);
    showTravelData(districtArr,districtValue,page);
  })
}
// 分頁資料
function pagination(districtArr,nowPage=1) {
  const districtLength = districtArr.length;
  const dataPerPage = 8;
  const pageTotal = Math.ceil(districtLength / dataPerPage);
  const newDistrictArr = [];
  // 當前頁數
  let currentPage = nowPage;  
  // 傳到 pageBtn function
  const page = {
    pageTotal,
    currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal
  }
  console.log(`全部資料:${districtLength} 每一頁顯示:${dataPerPage}筆 總頁數:${pageTotal} 當前頁數:${currentPage}`);
  
  // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  };
  const minIndex = (currentPage * dataPerPage) - dataPerPage + 1;
  const maxIndex = (currentPage * dataPerPage);
  districtArr.forEach((item, index) => {
    const currentIndex = index + 1;
    // 當 index 比 minIndex 大且又小於 maxIndex 就 push 進去新陣列
    if (currentIndex <= maxIndex && currentIndex >= minIndex) {
      newDistrictArr.push(item);
    };
  })
  console.log(newDistrictArr);
  showPageData(newDistrictArr);
  pageBtn(page);
}
// 將分配好的頁面資料陣列顯示
function showPageData(newDistrictArr) {
  list.innerHTML = '';
  for (let i = 0; i < newDistrictArr.length; i += 1) {
    let element = document.createElement('li');
    element.classList.add('list-item');
    // console.log(districtArr[i]);
    // console.log(travelData);
    // console.log(travelData[i],i);
    let endStr = (newDistrictArr[i].Add).indexOf('區');
    // console.log(endStr);
    districtStr = (newDistrictArr[i].Add).slice(6, endStr+1);
      element.innerHTML = 
      `<a href="#" class="travel-img text-white">
      <img src="${newDistrictArr[i].Picture1}" alt="travel picture">
      <div class="d-flex justify-content-between district-group align-items-center">
      <h3 class="travel-title">
      ${newDistrictArr[i].Name} 
      </h3>
      <p class="district-text">${districtStr}</p>
      </div>
      </a>

      <ul>
          <li class="travel-info d-flex">
              <div class="travel-info-icon"><img src="./assets/icons_clock.png" alt=""></div>
              ${newDistrictArr[i].Opentime}
          </li>
          <li class="travel-info d-flex align-items-center">
          <div class="travel-info-icon"><img src="./assets/icons_pin.png" alt=""></div>
              ${newDistrictArr[i].Add}
          </li>
          <li class="travel-info d-flex align-items-center">
          <div class="travel-info-icon"><img src="./assets/icons_phone.png" alt=""></div>
              ${newDistrictArr[i].Tel}
          </li>
      </ul>
      <p class="ticket-info">
      <img src="./assets/icons_tag.png" alt="">
       <span></span>
      </p>`;
      if (newDistrictArr[i].Ticketinfo === '') {
        element.querySelector('.ticket-info span').innerHTML = `
          免費開放
        `;
      };
      list.appendChild(element);
  };
}
// 顯示分頁按鈕
function pageBtn(page) {
  paginationList.innerHTML = '';
  if (page.hasPage) {
    let element = document.createElement('li');
    element.classList.add('page-item');
    element.innerHTML = `<a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">&lt Previous</a>`;
    paginationList.appendChild(element);
  }
  for (let i = 0; i < page.pageTotal; i++) {
    let element = document.createElement('li');
    element.classList.add('page-item');
    if (Number(page.currentPage) === i+1) {
      element.innerHTML = `<a class="page-link active" href="#" data-page="${i+1}">${i+1}</a>`;
    } else {
      element.innerHTML = `<a class="page-link" href="#" data-page="${i+1}">${i+1}</a>`;
    }
    paginationList.appendChild(element);
  }
  if (page.hasNext) {
    let element = document.createElement('li');
    element.classList.add('page-item');
    element.innerHTML = `<a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">Next &gt</a>`;
    paginationList.appendChild(element);
  }
}
// 點擊回到最上方
document.querySelector('.scroll-top').addEventListener('click', function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})