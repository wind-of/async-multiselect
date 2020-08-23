<template>
  <div id="app">
    <div class="multiselect" ref="multiselect">
      <input 
          type="text" 
          v-model="cityNameInput"
          @input="findCities"
          @click="showSelects"
          @keydown.down="activateSelect('forward')"
          @keydown.up="activateSelect('backward')"
          @keydown.enter="chooseCity(currentActiveSelectIdx)"
      >
      <div class="progress-bar" v-if="searchingCities">
        Loading...
      </div>
      <template v-else>
        <div v-if="error" class="error">
          {{ error }}
        </div>
        <div 
            v-else
            class="selects" 
            ref="selects"
        >
          <div 
              class="select"
              :class="{'active': active}"
              v-for="{ cityName, active, idx } in cities"
              :key="idx + cityName + idx"
              @click="chooseCity(idx)"
          >
            {{ cityName }}
          </div>
        </div>
      </template>
    </div>
    <div class="selected">
      Выбраны:
      <template v-for="{ cityName } in selectedCities">
        {{ cityName }}
      </template>
    </div>
    <button class="clear" @click="clearSelectedList">
      Clear
    </button>
  </div>
</template>

<script>
import { GET_CITIES } from "@/api/get.cities"
export default {
  name: "Multiselect",

  errors: {
    "NOT_FOUND": "А ничего не найдено! Сасатб+лежатб.",
    "ABORT": "Время поиска истекло."
  },

  data() {
    return {
      currentActiveSelectIdx: -1,
      searchingCities: false,
      error: null,
      cities: [],
      selectedCities: [],
      cityNameInput: ""
    }
  },

  methods: {
    filteredCities(cities) {
      return cities.slice()
        .filter((city) => city.includes(this.cityNameInput))
        .map((cityName, idx) => ({ cityName, selected: false, active: false, idx }))
    },

    showSelects() {
      if(this.$refs.selects) {
        this.$refs.selects.style.display = "block"
      }
      document.addEventListener("click", (event) => {
        if(
          this.$refs && 
          !this.$refs.multiselect.isSameNode(event.target.closest(".multiselect")) && 
          this.$refs.selects
        ) {
          this.$refs.selects.style.display = "none"
        }
        this.currentActiveSelectIdx = -1
      })
    },

    activateSelect(direction) {
      const newIdx = this.currentActiveSelectIdx + ({ "forward": 1, "backward": -1 })[direction];
      if(!this.cities.length || newIdx < 0 || newIdx >= this.cities.length){
        return
      }
      const currentActiveSelect = this.cities[this.currentActiveSelectIdx]
      if(currentActiveSelect) {
        currentActiveSelect.active = false
      }
      this.cities[newIdx].active = true
      this.currentActiveSelectIdx = newIdx
    },

    findCities() {
      this.searchingCities = true;
      GET_CITIES()
        .then((cities) => {
          this.currentActiveSelectIdx = -1
          this.error = null
          if(!this.cityNameInput) {
            return this.cities = []
          }
          const foundCities = this.filteredCities(cities)
          foundCities.length > 0
              ? this.cities = foundCities
              : this.setError("NOT_FOUND")
        })
        .catch(this.setError)
        .finally(this.finishSearching)
    },

    setError(errorType) {
      this.error = this.$options.errors[errorType]
    },

    finishSearching() {
      this.searchingCities = false
    },

    chooseCity(cityIdx) {
      if(this.selectedCities.indexOf(this.cities[cityIdx]) === -1) {
        this.selectedCities.push(this.cities[cityIdx])
      }
    },

    clearSelectedList() {
      this.selectedCities = [];
    }
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.multiselect{
  display: inline-block;
  .selects{
    max-width: 200px;
    max-height: 200px;
    display: none;
    overflow-y: auto;
  }
  input {
    max-width: 130px;
    border: 1px solid grey;
    border-radius: 0;
  }
}
.selects{
  width: 98px;
  display: none;
  .select{
    width: inherit;
    padding: 4px;
    font-size: 12px;
    cursor: pointer;
    &:hover, &.active{
      background: #1e90ff;
      color: white;
    }
  }
}
</style>
