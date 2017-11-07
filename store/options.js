export const state = () => ({
  activeMenu: null,
  activeGroupMenu: []
})

export const mutations = {
  SET_ACTIVE: function (state, route) {
    state.activeMenu = route
  },
  SET_GROUP: function (state, group) {
    // state.activeGroupMenu.push(group)
  }
}
