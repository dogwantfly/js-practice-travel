// 選取 select
const selectLocation = document.querySelector('.select-location');
let travelDataArr = JSON.parse(localStorage.getItem('travelData'));
let list = document.querySelector('.list');
let trendingDistrict = document.querySelector('.navbar-trending ul');
// 拿資料
function getTravelData() {
  // 產生一個 XMLHttpRequest
  const request = new XMLHttpRequest();
  // 當 request 拿到結果（文檔載入完成）時會觸發 onload 事件，執行此 function
  request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
          const response = request.responseText;
          const json = JSON.parse(response);
          // console.log(json);
          let travelData = json.data.XML_Head.Infos.Info;
          localStorage.setItem('travelData', JSON.stringify(travelData));
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
selectDistrict(travelDataArr);

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
    showTravelData(travelData);
  } else {
    list.innerHTML = '';
    showTravelData(travelData,districtValue);
  };
}
// 點擊熱門行政區
function clickDistrict(travelData,target) {
  let districtValue = target.innerText;
  console.log(districtValue);
  if (districtValue === '') {
    list.innerHTML = '';
    console.log(districtValue,'1');
    showTravelData(travelData);
  } else {
    list.innerHTML = '';
    console.log(districtValue,'2');
    showTravelData(travelData,districtValue);
  };
}

// 將特定行政區景點顯示在畫面上
function showTravelData(travelData,districtValue) {
  let index = 1;
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
  let endIndex = 7;
  if (endIndex >= districtArr.length) {
    endIndex = (districtArr.length)-1;
  };
  for (let i = 0; i <= endIndex; i += 1) {
    let element = document.createElement('li');
    element.classList.add('list-item');
    console.log(districtArr[i],i);
    let endStr = districtArr[i].Add.indexOf('區');
    districtStr = (districtArr[i].Add).slice(6,endStr+1);
    
    // console.log(districtStr);
      element.innerHTML = 
      `<a href="#" class="travel-img text-white">
      <img src="${districtArr[i].Picture1}" alt="travel picture">
      <div class="d-flex justify-content-between district-group align-items-center">
      <h3 class="travel-title">
      ${districtArr[i].Name} 
      </h3>
      <p class="district-text">${districtStr}</p>
      </div>
      </a>

      <ul>
          <li class="travel-info d-flex">
              <div class="travel-info-icon"><img src="./assets/icons_clock.png" alt=""></div>
              ${districtArr[i].Opentime}
          </li>
          <li class="travel-info d-flex align-items-center">
          <div class="travel-info-icon"><img src="./assets/icons_pin.png" alt=""></div>
              ${districtArr[i].Add}
          </li>
          <li class="travel-info d-flex align-items-center">
          <div class="travel-info-icon"><img src="./assets/icons_phone.png" alt=""></div>
              ${districtArr[i].Tel}
          </li>
      </ul>
      <p class="ticket-info">
      <img src="./assets/icons_tag.png" alt="">
       <span></span>
      </p>`;
      if (districtArr[i].Ticketinfo === '') {
        element.querySelector('.ticket-info span').innerHTML = `
          免費開放
        `;
      };
      list.appendChild(element);
      index++;
  };
  // 點擊分頁
  document.querySelector('.pagination').addEventListener('click', function(e) {
    if (e.target.classList.contains('page-link') ){
      e.preventDefault();
      list.innerHTML = '';
      let pageIndex = 1;
      let startIndex = (Number(e.target.innerText) - pageIndex) * 8;
      let endIndex = startIndex + 8;
      if (endIndex > districtArr.length) 
        {endIndex = (districtArr.length);
      };
      console.log(startIndex,endIndex);
      
      for (let i = startIndex; i < endIndex; i += 1) {
        districtStr = districtArr[i].Add.slice(6,9);
        let element = document.createElement('li');
        element.classList.add('list-item');
        // console.log(districtArr[i]);
          element.innerHTML = 
          `<a href="#" class="travel-img text-white">
          <img src="${districtArr[i].Picture1}" alt="travel picture">
          <div class="d-flex justify-content-between district-group align-items-center">
          <h3 class="travel-title">
          ${districtArr[i].Name} 
          </h3>
          <p class="district-text">${districtStr}</p>
          </div>
          </a>
          <ul>
              <li class="travel-info d-flex">
              <div class="travel-info-icon"><img src="./assets/icons_clock.png" alt=""></div>
                  ${districtArr[i].Opentime}
              </li>
              <li class="travel-info d-flex align-items-center">
              <div class="travel-info-icon"><img src="./assets/icons_pin.png" alt=""></div>
                  ${districtArr[i].Add}
              </li>
              <li class="travel-info d-flex align-items-center">
              <div class="travel-info-icon"><img src="./assets/icons_phone.png" alt=""></div>
                  ${districtArr[i].Tel}
              </li>
          </ul>
            <p class="ticket-info">
            <img src="./assets/icons_tag.png" alt="">
             <span></span>
            </p>`;
          if (districtArr[i].Ticketinfo === '') {
            element.querySelector('.ticket-info span').innerHTML = `
              免費開放
            `;
          };
          list.appendChild(element);
          index++;
      };
    };
  })
}
// 點擊回到最上方
document.querySelector('.scroll-top').addEventListener('click', function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})