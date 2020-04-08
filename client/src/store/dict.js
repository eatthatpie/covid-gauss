export default {
  state: {
    locale: 'en',
    items: {
      castYourVote: {
        en: 'Cast your vote and see how others think.',
        pl: 'Oddaj głos i zobacz, jak głosowali inni.'
      }
    }
  },
  getters: {
    getTranslation(state) {
      return function(key) {
        if (!state.items.hasOwnProperty(key)) {
            return null
        }

        if (!state.items[key].hasOwnProperty(state.locale)) {
          return state.items[key].en
        }
  
        return state.items[key][state.locale]
      }
    }
  },
  mutations: {
    setLocale(state, locale) {
      state.locale = locale
    }
  },
  namespaced: true
}
