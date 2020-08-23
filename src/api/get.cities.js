const url = "http://localhost:3004/cities"
let cachedCities = null

export function GET_CITIES() {
  return new Promise((resolve, reject) => {
    if(cachedCities) {
      resolve(cachedCities)
    }
    const xhr = new XMLHttpRequest()
    xhr.timeout = 3000;
    xhr.addEventListener("error", () => reject("NOT_FOUND"))
    xhr.addEventListener("abort", () => reject("ABORT"))
    xhr.addEventListener("load", (event) => {
      const cities = JSON.parse(event.currentTarget.response)
      cachedCities = cities
      resolve(cities)
    })
    xhr.open("GET", url)
    xhr.send()
  })
} 