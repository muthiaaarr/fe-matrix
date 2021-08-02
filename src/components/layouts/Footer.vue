<script>
export default {
  name: "Footer",
  data: () => ({
    footer: {
      inset: false
    }
  })
};
</script>

<template>
  <v-footer :inset="footer.inset" app style="box-shadow: 0px 2px 10px #888888; background-color: #262125; color: white">
    <v-flex md12 xs12 class="footer">
      <span class="px-4">&copy; {{ new Date().getFullYear() }}, Designed by PT. Padepokan Tujuh Sembilan</span>
    </v-flex>
  </v-footer>
</template>
