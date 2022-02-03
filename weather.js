// const { default: axios } = require("axios");
const block = $(".weather_details")

const showList = (list) => {

    if(list === null){

    }

    else{

        var ul = document.querySelector(".all_preferences")

        const e = document.querySelector(".all_preferences li")
      
        ul.innerHTML = ""
      
        list.map((EI) => {
          console.log(EI.place)
      
          var li = document.createElement("li")
          li.setAttribute("class", "listitem")
          li.appendChild(document.createTextNode(EI.place))
          ul.appendChild(li)
      
          // return <p>EI.name</p>
        })
      
        const userPreferences = JSON.parse(localStorage.getItem("userPreferences"))

        var x = document.querySelector(".search_bar").value
        console.log(x)
      
        if (x.length === 0) {
          $(".all_preferences").addClass("hide")
        } else {
          $(".all_preferences").removeClass("hide")
        }

    }


}

window.onload = function () {
  const userPreferences = JSON.parse(localStorage.getItem("userPreferences"))

  console.log(userPreferences);

  showList(userPreferences)

  $(".all_preferences").addClass("hide")

  const block = $(".weather_details")

  block.addClass("hide")
}

$(document).on("click", ".all_preferences .listitem", function () {
  // alert('Clicked');
  console.log("this", this.innerText)

  $(".search_bar").val(this.innerText)

  handleClick()
})

const userPreferences = () => {
  var x = document.querySelector(".search_bar").value
  console.log(x)

  const userPreferences = JSON.parse(localStorage.getItem("userPreferences"))

  if(userPreferences === null){

  }

  else{
  
    var ul = document.querySelector(".all_preferences")

    const filterd = userPreferences.filter((EI) => {
      if (EI.place.toUpperCase().includes(x.toUpperCase())) {
        return EI
        console.log("true")
      }
    })
  
    console.log("filtered", filterd)
  
    showList(filterd)
  }

}

const GeoCode = (address, cb) => {
  const url =
    "https://cors-anywhere.herokuapp.com/https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    address +
    ".json?access_token=pk.eyJ1IjoibWF5YW5rMTI0IiwiYSI6ImNreTlwdXBldjA4aGoyb29jbjd5ZW16cnAifQ.7InN2qkKmpdcSiHYknzJkQ"

  axios
    .get(url)
    .then(({data}) => {
      if (data.features.length > 0) {
        console.log(
          "response",
          data.features[0].center,
          data.features[0].place_name
        )
        const {center, place_name} = data.features[0]
        cb(undefined, center, place_name)
      } else {
        console.log("unable to find location")
        cb("unable to find location")
      }
    })
    .catch((err) => {
      if (err) {
        if (err) {
          if (err.response) {
            console.log(err.response.data.message)
            cb(err.response.data.message)
          } else {
            console.log("network -error", err)
            cb("network error")
          }
        }
      }
    })
}

const saveToLocalStorage = (place_name) => {
  const userPreferences = JSON.parse(localStorage.getItem("userPreferences"))

  if (userPreferences === null) {
    const userPreference = [
      {
        place: place_name,
      },
    ]

    localStorage.setItem("userPreferences", JSON.stringify(userPreference))

    showList(userPreferences)

    $(".all_preferences").addClass("hide")
  } else {
    console.log(userPreferences)

    userPreferences.push({
      place: place_name,
    })

    localStorage.setItem("userPreferences", JSON.stringify(userPreferences))

    showList(userPreferences)

    $(".all_preferences").addClass("hide")
  }
}

const GetWeatherData = (lat, lon, place_name) => {
  axios
    .get(
      `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aa76bfbe6bce3503832cd0a587a29c86&units=metric`
    )
    .then((result) => {
      console.log("result2", result)

      if (result.status === 200) {
        const {description} = result.data.weather[0]
        const {temp_min, temp_max, temp} = result.data.main

        console.log(temp_min, temp_max, description, temp, place_name)

        block.removeClass("hide")

        $(".weather_details .place").text(place_name)
        $(".weather_details .temp .degree").text(temp)
        $(".weather_details .temp_max .temp_max_value").text(temp_min)
        $(".weather_details .temp_min .temp_min_value").text(temp_min)
        $(".weather_details .description").text(description)

        $("input").val("")

        saveToLocalStorage(place_name)
      }
    })
    .catch((err) => {
      console.log("error", err)
    })
}

const handleClick = async () => {
  const place = document.querySelector(".search_bar").value

  if (place.trim().length === 0) {
    return alert("please search any country city")
  }

  block.addClass("hide")

  GeoCode(place, (err, center, place_name) => {
    console.log("err", err + "center" + center + "place_name" + place_name)

    if (err) {
      return console.log("error", err)
    }

    console.log("center", center)

    GetWeatherData(center[1], center[0], place_name)
  })
}
