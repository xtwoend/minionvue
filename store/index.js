
export const state = () => ({
  isAuth: true,
  user: null
})

export const mutations = {
  SET_USER: function (state, user) {
    state.user = user
  },
  IS_AUTH: function (state, status) {
    state.isAuth = status
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    // console.log(route)
    // console.log(req)
    // commit('options/SET_ACTIVE', 'posts')
  },
  auth ({ commit }, status) {
    commit('IS_AUTH', status)
  }
}
