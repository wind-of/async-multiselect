const url = "http://localhost:3004/cities"
let cachedCities = null

export function GET_CITIES() {
  return new Promise((resolve, reject) => {
    if(cachedCities) {
      resolve(cachedCities)
    }
    const request = new XMLHttpRequest()
    request.timeout = 3000
    request.addEventListener("error", () => reject("NOT_FOUND"))
    request.addEventListener("timeout", request.abort)
    request.addEventListener("abort", () => reject("ABORT"))
    request.addEventListener("load", (event) => {
      const cities = JSON.parse(event.currentTarget.response)
      cachedCities = cities
      resolve(cities)
    })
    request.open("GET", url)
    request.send()
  })
} 