<script>
import "./assets/css/global-styles.css";
import firebase from "./firebase";
import "firebase/messaging";
import "firebase/app";
export default {
  name: "App",
  created() {
    // this.$vuetify.theme.dark = false;

    const messaging = firebase.messaging();
    messaging
      .requestPermission()
      .then(function () {
        return messaging.getToken();
      })
      .then(function (token) {
        localStorage.setItem("fbToken", token)
      })
      .catch(function (err) {
        console.log("Token is null");
      });
  },
  data: () => ({
    drawers: ["Default (no property)", "Permanent", "Temporary"],
    primaryDrawer: {
      model: null,
      type: "temporary",
      clipped: false,
      floating: false,
      mini: false,
    },
  }),
};
</script>

<template>
  <v-app id="app">
    <router-view />
  </v-app>
</template>
