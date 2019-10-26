import firebase, { db } from "~/plugins/firebase";

export const state = () => ({
  token: "",
  secret: "",
  user: null,
  isLogin: false,
  comics: []
});

export const mutations = {
  login(state, token, secret, user) {
    state.token = token;
    state.secret = secret;
    state.user = { ...user };
    state.isLogin = true;
  },
  logout(state) {
    state.token = '';
    state.secret = '';
    state.user = null;
    state.isLogin = false;
  },
  setComics(state, comics) {
    state.comics = comics;
  }
};

export const actions = {
  login({ commit }, user) {
    commit('login', user)
  },
  async logout({ commit }) {
    await firebase.auth().signOut().then(() => {
      commit('logout');
    }).catch(error => {
      // TODO: display error message
      console.error(error);
    });
  },
  async getComics({ commit }) {
    let comics = null;
    try {
      comics = (await db.collection('Books')).data();
    } catch(error) {
      // TODO: display error message
      console.error(error);
    }
    commit('setComics', comics);
    return comics;
  }
}
