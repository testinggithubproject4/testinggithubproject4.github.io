const sethh = document.querySelector("#hh");
const setmm = document.querySelector("#mm");
const setss = document.querySelector("#ss");
const currentTime = document.querySelector("#PresentTime");
const setAmPm = document.querySelector("#meridian_indicator");
const AdjustAlarmbtn = document.querySelector("#confirmBtn");
const alarm_list = document.querySelector("#Holder_Part_Alarm");
let ringtone = new Audio("ringtone.mp3");  

// Adding hh, mm, ss in list Menu  

window.addEventListener("DOMContentLoaded", (event) => {
  
  ListMenu(1, 12, sethh);
 
  ListMenu(0, 59, setmm);

  ListMenu(0, 59, setss);

  setInterval(fetchPresentTime, 1000);
});
//
function ListMenu(s, e, element) {
  for (let i = s; i <= e; i++) {
    const list = document.createElement("option");
    list.value = i < 10 ? "0" + i : i;
    list.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(list);
  }
}


function fetchPresentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}

// Fetching alarms from local storage 
function RetrieveAlarm() {
  const saved_alarm = Alarm_Checker();

  saved_alarm.forEach((time) => {
    Add_Alarm(time, true);
  });
}
//
function Add_Alarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === fetchPresentTime()) {
      alert("Alarm Ringing");
	  ringtone.play();
    }
    console.log("working");
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    recordAlarm(time);
  }
}

// Alarms set by user Dislayed in HTML 
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div"); 
  //dynamically creating an HTML element "div" via JavaScript
  alarm.classList.add("alarm", "mfoot", "display");
  //Adding effects to css class assigned to html element using classList object
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="button remove_Alarm" data-id=${intervalId}>Delete</button>
              `;
  const removeAlarm = alarm.querySelector(".remove_Alarm");
  removeAlarm.addEventListener("click", (e) => del_Alarm(e, time, intervalId));

  alarm_list.prepend(alarm);
}

// Is alarms saved in Local Storage?
function Alarm_Checker() {
  let alarm_array = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarm_array = JSON.parse(isPresent);

  return alarm_array;
}

// Event Listener added to AdjustAlarmbtn
AdjustAlarmbtn.addEventListener("click", ScanTime);

//Function to take input from user 
function ScanTime(e) {
  e.preventDefault();
  const hh_val = sethh.value;
  const mm_val = setmm.value;
  const ss_val = setss.value;
  const meridian_val = setAmPm.value;

  const AlarmAlertTime = Time_Converter(
    hh_val,
    mm_val,
    ss_val,
    meridian_val
  );
  Add_Alarm(AlarmAlertTime);
}

// Converting time to 24 hour format (7.1)
function Time_Converter(hh, mm, ss, meridian) {
  return `${parseInt(hh)}:${mm}:${ss} ${meridian}`;
}

// save alarm to local storage(9)
function recordAlarm(time) {
  const save_alarm = Alarm_Checker();

  save_alarm.push(time);
  localStorage.setItem("save_alarm", JSON.stringify(save_alarm));
}

//Delete funtion
function del_Alarm(event, time, intervalId) {
  const This = event.target;

  clearInterval(intervalId);

  const alarm = This.parentElement;
  console.log(time);

  del_AlarmFromLocal(time);
  ringtone.pause();
  alarm.remove();
}

function del_AlarmFromLocal(time) {
  const del_alarm = Alarm_Checker();
  const index = del_alarm.indexOf(time);
  del_alarm.splice(index, 1);
  localStorage.setItem("del_alarm", JSON.stringify(del_alarm));
}