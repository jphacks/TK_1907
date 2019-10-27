import firebase, { db } from "~/plugins/firebase";

export const state = () => ({
  user: {
    name: "",
    photo: "",
    id: "@"
  },
  isLogin: false,
  comics: [],
  web3: null
});

export const mutations = {
  login(state, user) {
    state.user = { ...user };
    state.isLogin = true;
  },
  logout(state) {
    state.token = "";
    state.secret = "";
    state.user = {};
    state.isLogin = false;
  },
  setComics(state, comics) {
    state.comics = comics;
  },
  addComic(state, comic) {
    state.comics = [...state.comics, comic];
  },
  setWeb3(state, web3) {
    state.web3 = web3;
  }
};

export const actions = {
  login({ commit }, user) {
    commit("login", user);
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
  },
  setWeb3({ commit }, web3) {
    commit("setWeb3", web3);
  }
};
