export default {
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - marine",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Oswald:400,700"
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** environment varials
   */
  env: {
    API_KEY: "AIzaSyDDQlPaf74PVMQhYtVvlr9EZ8e9nuaW2K8",
    AUTH_DOMAIN: "marine-dev.firebaseapp.com",
    DATABASE_URL: "https://marine-dev.firebaseio.com",
    PROJECT_ID: "marine-dev",
    STORAGE_BUCKET: "marine-dev.appspot.com",
    MESSAGING_SENDER: "23225479459",
    APP_ID: "1:23225479459:web:88c0b15d099ee08c1fdc96",
    MEASUREMENT_ID: "G-7BE66T8Z8F"
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev }) {
      if (isDev && process.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },
  modules: [
    // Simple usage
    "nuxt-buefy",

    [
      "nuxt-buefy",
      {
        /* buefy options */
      }
    ]
  ]
};
