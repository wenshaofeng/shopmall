export default {
  updateUserInfo(state, nickName) {
    state.nickName = nickName
  },
  updateCartCount(state, cartCount) { //叠加
    state.cartCount += cartCount
  },
  initCartCount(state, cartCount) { //初始化
    state.cartCount = cartCount
  }
}
