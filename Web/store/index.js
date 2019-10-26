import Vuex from 'vuex'

const store = () => new Vuex.Store({

  state: {
    scriptHash: 'aa0631bd09b916affa8188a48df04f7f426aca29',
    privateKey: '',
    isLogin: false,
    neoGas: '0',
    comics: []
  },
  mutations: {
    login (state, privateKey) {
      state.privateKey = privateKey
      state.isLogin = true
    },
    setNeoGas(state, neoGas) {
      state.neoGas = neoGas
    },
    setComics(state, comics) {
      state.comics = comics
    }
  }
})

export default store
