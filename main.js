function weatherSearch(city){
  let xhr = new XMLHttpRequest();
  let link = 'https://api.openweathermap.org/data/2.5/weather?';
  let appid = '73a2f4a5254e97adabb2160caa6234a8'
  let myRequest = link + 'q=' + city + '&appid=' + appid;
  console.log(myRequest);
  xhr.open('GET', myRequest, false);
  xhr.send();

  if (xhr.status != 200) {
    console.log( xhr.status + ': ' + xhr.statusText );
    return null;
  } else {
    let res = JSON.parse(xhr.responseText);
    return res;
  }
}

function weatherParser(resFromAPI){
  let res = {};
  let KelvinsInCelsius = 273.15;
  res.temp = Math.round(parseFloat(resFromAPI.main.temp) - KelvinsInCelsius);
  res.pressure = resFromAPI.main.pressure;
  res.humidity = resFromAPI.main.humidity;
  res.weather = resFromAPI.weather[0].description;
  res.wind = resFromAPI.wind.speed;
  return res;
}

function yTranslator(text, lang){
  let xhr = new XMLHttpRequest();
  let link = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';
  let key = 'trnsl.1.1.20190919T124743Z.dca6b4bd08046305.72d79d996d3b2d2aeda0f3e79b14b36111e3ef2c'
  let myRequest = link + 'options=1' + '&key=' + key + '&text=' + text + '&lang=' + lang;

  xhr.open('GET', myRequest, false);
  xhr.send();

  if (xhr.status != 200) {
    console.log( xhr.status + ': ' + xhr.statusText );
    return null;
  } else {
    let res = JSON.parse(xhr.responseText);
    return res.text[0];
  }
}

function resultsDisplay(param, value){
  let myTemplate = doT.template(document.getElementById('my-test').innerHTML);
  let label = param[0].toUpperCase() + param.slice(1) + ': ' + value;
  let compTemp = myTemplate({
      param: param,
      value: yTranslator(label, 'ru')
  	})
  document.getElementById('result_blocks').insertAdjacentHTML('beforeend', compTemp);
}

function printError(str){
	let myTemplate = doT.template(document.getElementById('my-error').innerHTML);
	let compTemp = myTemplate({
		str: str
	})
	document.getElementById('result_blocks').insertAdjacentHTML('beforeend', compTemp);
}

document.getElementById('search_block').addEventListener('submit', function(event){
	event.preventDefault();
	document.getElementById('result_blocks').innerHTML = '';
	let text = event.target['myInput'].value;
	let enSearchString = yTranslator(text, 'en');
	if (!enSearchString) { 
		printError('Ошибка при обращении к API Yandex');
		return;
	}
    console.log(enSearchString);
    let weatherRes = weatherSearch(enSearchString);
    if (!weatherRes) { 
		printError('Ошибка при обращении к API OpenWeatherMap');
		return;
	}
    console.log(weatherRes);
    let finalData = weatherParser(weatherRes);
	for (i in finalData) {
		resultsDisplay(i, finalData[i])
	}
	return;
})
