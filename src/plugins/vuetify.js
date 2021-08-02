import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#1e88e5',
        secondary: '#03a9f4',
        accent: '#00bcd4',
        error: '#f44336',
        warning: '#ff5722',
        info: '#ffc107',
        success: '#4caf50'
      },
      dark: {
        primary: '#1e88e5',
        secondary: '#03a9f4',
        accent: '#00bcd4',
        error: '#f44336',
        warning: '#ff5722',
        info: '#ffc107',
        success: '#4caf50'
      }
    }
  }
});