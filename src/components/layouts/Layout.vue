<script>
import Footer from "./Footer";
import Header from "./Header";
export default {
  name: "Layout",
  components: { Footer, Header },
  data: () => ({
    drawers: ["Default (no property)", "Permanent", "Temporary"],
    primaryDrawer: {
      model: null,
      type: "temporary",
      clipped: false,
      floating: false,
      mini: false
    }
  })
};
</script>

<template>
  <v-app id="layout">
    <Header></Header>
    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <router-view />
        </v-layout>
      </v-container>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>
