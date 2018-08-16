var socket = io.connect('/');

/**
 * Date and time Top / Top left
 */
socket.on('time', (data) => {  
  console.log('socket.on - ' + data.clock);
    $('#time').html(data.clock);
    $('#date').html(data.date);
});


socket.on('moto', (data) => {  
  console.log('socket.on - ' + data);
    $('#moto').html(data);
});


socket.on('rss', (data) => {  
  console.log('rss');
     $('#text').html('|     ' + data.items[0].pubDate.substring(16, 22) + data.items[0].pubDate.substring(4,11)  +' - ' + data.items[0]['content:encoded'] + '     |    ' + data.items[1].pubDate.substring(16, 22) + data.items[1].pubDate.substring(4,11)  +' - ' + data.items[1]['content:encoded'] + '      |');
    //for(var i = 0; data.items.length > i; i++ ){
      //console.log(i);
    //}
});


/**
 * Weather top right
 */
socket.on('weather', (data) => {

    $('#weather').html(data.name);
    $('#desc').html(data.weather[0].description);
    //$('#temp').html(data.main.temp + ' and ' + data.weather[0].description + ' ' +data.weather[0].icon);
    $('#temp').html(Math.round(data.main.temp) + '<sup>o</sup>');
    $('#windspeed').html(data.wind.speed);
    $('#icon').html(data.weather[0].icon);
    //$('#img').html("/assets/icon/" + data.weather[0].icon + ".png");
    document.getElementById("img").src = "/assets/icon/" + data.weather[0].icon + ".png";
  });

socket.on('weatherforecast', (data) => {
  console.log(JSON.stringify(data.list[0]));
  var ul = document.getElementById("weather-forecast");
  if(ul.innerHTML.length >  0){
    $("#weather-forecast").html("");
  }

  // Appending li with todos
  for( var i = 0; i < data.list.length; i++ )
  {
    o = data.list[i];
    var li = document.createElement("li");
    var icon = document.createElement("img");
    icon.setAttribute('src','/assets/icon/' + o.weather[0].icon + '.png');
    icon.setAttribute('width','30px');
    li.appendChild(document.createTextNode(o.temp.day + "  |  " + o.temp.max + "  |  " + o.temp.min + "  |  "  ) );
    li.appendChild(icon);
    ul.appendChild(li);

  }
  
});

/**
 * Todo bottom left
 */
socket.on('busstider', (data) => {
  console.log('Data' + data.length);
  var ul = document.getElementById("busstider");
console.log(data[0].no[0]);
  // If UL have li objects, remove them
  if(ul.innerHTML.length >  0){
    $("#busstider").html("");
  }

  // Appending li with todos
  for( var i = 0; i < 3; i++ )
  {
    o = data[i];
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(o.no[0] + ':an Avgår ' + o.dt[0].substring(11, 16)));

    ul.appendChild(li);
  }
});


/**
 * Todo bottom left
 */
socket.on('todos', (data) => {  
  // Getting the UI object
  var ul = document.getElementById("item");

  // If UL have li objects, remove them
  if(ul.innerHTML.length >  0){
    $("#item").html("");
  }

  // Appending li with todos
  for( var i = 0; i < data.length; i++ )
  {
    o = data[i];
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(o.item));
    ul.appendChild(li);
  }

});
