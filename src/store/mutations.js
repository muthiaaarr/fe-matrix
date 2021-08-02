export default {
  toggleLoading (state) {
    state.callingAPI = !state.callingAPI
  },
  toggleSearching (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  setUser (state, user) {
    state.user = user
  },
  setToken (state, token) {
    state.token = token
  },
  increment(state) {
    state.messages++
  },
  decrement(state) {
    if (state.messages > 0) {
      state.messages--
    }
  }
}
