<script>
import router from "./../../router/routes";
import Swal from "sweetalert2";
import { setTimeout } from "timers";
import { MatrixService } from "../../service";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-right",
  showConfirmButton: false,
  timer: 3000,
});
export default {
  props: {
    source: String,
  },
  data: () => ({
    valid: true,
    loading: false,
    username: "",
    usernameRules: [
      (v) => !!v || "Username is required",
      (v) =>
        (v && v.length <= 32) || "Username must be less than 32 characters",
    ],
    password: "",
    passwordRules: [(v) => !!v || "Password is required"],
    visiblePassword: false,
  }),
  methods: {
    doLogin() {
      this.loading = true;
      if (this.username === "talent" && this.password === "talent") {
        setTimeout(function () {
          this.loading = false;
          localStorage.setItem("sessionToken", "dummyToken");
          localStorage.setItem("userId", "1");
          localStorage.setItem("fullName", "Ridwan");
          localStorage.setItem("role", "Talent");
          localStorage.setItem("division", "Project");
          Toast.fire({
            type: "success",
            title: "Login in successfully",
          });
          router.push("/dashboard");
        }, 1000);
      } else if (this.username === "spv" && this.password === "spv") {
        setTimeout(function () {
          this.loading = false;
          localStorage.setItem("sessionToken", "dummyToken");
          localStorage.setItem("userId", "2");
          localStorage.setItem("fullName", "Karina");
          localStorage.setItem("role", "Supervisor");
          localStorage.setItem("division", "Management");
          Toast.fire({
            type: "success",
            title: "Login in successfully",
          });
          router.push("/dashboard");
        }, 1000);
      } else if (this.username === "hrd" && this.password === "hrd") {
        setTimeout(function () {
          this.loading = false;
          localStorage.setItem("sessionToken", "dummyToken");
          localStorage.setItem("userId", "3");
          localStorage.setItem("fullName", "Afina");
          localStorage.setItem("role", "HRD");
          localStorage.setItem("division", "Management");
          Toast.fire({
            type: "success",
            title: "Login in successfully",
          });
          router.push("/dashboard");
        }, 1000);
      } else {
        Toast.fire({
          type: "error",
          title: "Username or password is incorrect",
        });
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <v-content>
    <v-container fluid fill-height style="background: #fff; padding: 0px">
      <v-layout justify-space-between>
        <v-flex xs12 sm8 md4 style="align-self: center">
          <!-- <div
            id="logo-itm"
            style="margin-top: 10%; margin-left: 15px; zoom: 12%"
          >
            <v-row>
              <v-col md="8" offset-md="2">
                <img
                  src="./../../assets/logotujuhsembilan.png"
                  alt="avatar"
                  style="margin-left: 60px"
                />
              </v-col>
            </v-row>
          </div> -->
          <div id="form-login" style="zoom: 80%">
            <v-flex offset-md1 md10>
              <v-card style="border-radius: 20px; padding: 30px" class="elevation-4">
                <v-form
                  v-on:submit.prevent="doLogin"
                  v-model="valid"
                  lazy-validation
                >
                  <v-card-text>
                    <h1 style="margin-bottom: 5px">
                      <div style="margin-bottom: 10px">
                        LEAVE REQUEST APPLICATION
                      </div>
                      <h6>PT. Padepokan Tujuh Sembilan</h6>
                    </h1>
                    <label style="color: gray"
                      >Welcome, please login into your account</label
                    >
                  </v-card-text>
                  <v-card-text>
                    <v-text-field
                      label="Username"
                      name="username"
                      v-model="username"
                      :rules="usernameRules"
                      prepend-inner-icon="mdi-account-circle"
                      type="text"
                      :disabled="loading"
                      outlined
                      required
                    ></v-text-field>
                    <v-text-field
                      id="password"
                      label="Password"
                      name="password"
                      v-model="password"
                      :rules="passwordRules"
                      prepend-inner-icon="mdi-shield-lock"
                      :append-icon="visiblePassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="visiblePassword ? 'text' : 'password'"
                      :disabled="loading"
                      @click:append="visiblePassword = !visiblePassword"
                      outlined
                      required
                    ></v-text-field>
                    <v-flex text-left>
                      <a href>Forgot password?</a>
                    </v-flex>
                    <br />
                    <v-flex text-left>
                      <v-btn
                        name="login"
                        class="btn-block col-md-6"
                        color="primary"
                        type="submit"
                        :loading="loading"
                        :disabled="!valid || loading"
                        >Login</v-btn
                      >
                    </v-flex>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-flex>
          </div>
        </v-flex>
        <v-row class="cover-login" style="margin-left: 0px; margin-right: 0px">
          <!-- <v-col md8> -->
          <v-img
            src="../../assets/Background.jpg"
            lazy-src="../../assets/Background.jpg"
            class="grey lighten-2"
          />
          <!-- </v-col> -->
        </v-row>
      </v-layout>
    </v-container>
  </v-content>
</template>
