//import { convertDate } from "./utils";
var zip_code;
do
{zip_code = prompt("ENTER ZIP CODE");}
while (zip_code.length === 0 || !zip_code.trim()); 

let date = new Date().toLocaleDateString();
var data; 
  
function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
        //checking the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
       reject(Error(req.statusText));
       
      }
    };
    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
      
    };

    // Send the request
    req.send();
  });
}

//get response as JSON object
function getJSON(url) {
      return get(url).then(JSON.parse);
}
//making 2 API calls
getJSON(`https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=${zip_code}`).then(function(data) {
  
   document.getElementById("city").innerHTML = ("Weather Forecast For "+ data.city).toUpperCase();
  
    return getJSON(`https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&date=${date}`);
    }).then (function(weather){
       return weatherData(weather.daily); 
})    
//creating 3-day weather forecast
function weatherData(weathersample){
  //checking if zip code is valid
  if(document.getElementById("city").innerHTML.indexOf("UNDEFINED") !== -1) {
  document.getElementById("city").innerHTML = "Invalid Zip Code"; 
  } 
  else {
  var app = document.getElementById('app');
  var day = [];
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  var dateObj = new Date();
  //getting today's weekday from weekday number
  var weekdayNumber = dateObj.getDay();


  for (i=0; i<3; i++){
     //day container
     day[i] = document.createElement('div');
     day[i].style.cssText = 'float:left; width:180px; height:35px; background-color:#689bb8; border-style:solid; border-right-width:15px; border-bottom-width:100px; color:#ffffff; font:bold 20px arial,times new roman;';
     var weekday = '&nbsp' + weekdays[weekdayNumber + i] + ":<br>" ;
     //appending weekdays to the main div
     app.appendChild(day[i]);
     //assigning weekdays
     day[i].innerHTML = weekday;
     //image container
     var image = document.createElement('img');
     //temperature container
     var temp = document.createElement('p');
     temp.style.cssText = 'background-color:white; color:black; font:20px arial; display:inline-block';
     //appending image to day container
     day[i].appendChild(image);
     image.style.cssText = 'background-color:white; display:inline-block; border-style:solid; border-right-width:10px;';
     //selecting the image from icon value
     if (weathersample.data[i].icon == 'sunny')  {image.src = 'img/sunny.png'}
       else if (weathersample.data[i].icon == 'cloudy')  {image.src = 'img/cloudy.png'}
       else if (weathersample.data[i].icon == 'rain')  {image.src = 'img/rain.png'}
       else if (weathersample.data[i].icon == 'snow')  {image.src = 'img/snow.png'}
    //appending temperature container to day container 
    day[i].appendChild(temp);
    temp.textTransform = 'none';
    //capitalizing the 1st letter of summary
    var summary = weathersample.data[i].icon.charAt(0).toUpperCase() + weathersample.data[i].icon.slice(1);
    //displaying low and high temperatures
    temp.innerHTML = summary + '<br>' + (Math.round(weathersample.data[i].temperatureLow) + '\xB0').bold() + ' / ' + Math.round(weathersample.data[i].temperatureHigh) + '\xB0' + 'F';
    }}
}

