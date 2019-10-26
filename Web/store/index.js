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
    state.user = user;
    state.isLogin = true;
  },
  logout(state) {
    state.token = "";
    state.secret = "";
    state.user = null;
    state.isLogin = false;
  },
  setComics(state, comics) {
    state.comics = comics;
  },
  addComic(state, comic) {
    state.comics = [...state.comics, comic];
  }
};

export const actions = {
  login({ commit }, token, secret, user) {
    commit("login", token, secret, user);
  },
  async logout({ commit }) {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        commit("logout");
      })
      .catch(error => {
        // TODO: display error message
        console.error(error);
      });
  },
  setComics({ commit }, comics) {
    commit("setComics", comics);
  },
  addComic({ commit }, comic) {
    commit("addComic", comic);
  }
};
