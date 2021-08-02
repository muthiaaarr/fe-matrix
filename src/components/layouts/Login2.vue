<script>
import router from "./../../router/routes";
import Swal from "sweetalert2";
import { MatrixService } from "../../service";
import GoogleLogin from "vue-google-login";
import config from "../../service/config";

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
    // GOOGLE SIGN IN SETUP
    params: {
      client_id: `${config.clientId.development}`,
    },
    renderParams: {
      width: 250,
      height: 50,
    },
  }),
  components: {
    GoogleLogin,
  },
  methods: {
    doLogin() {
      this.loading = true;
      let data = {
        username: this.username,
        password: this.password,
      };
      MatrixService.login(data).then((res) => {
        if (res.data) {
          if (res.data.token != "") {
            localStorage.setItem("sessionToken", res.data.token);
            localStorage.setItem("userId", res.data.user.user_id);
            localStorage.setItem("fullName", res.data.user.name);
            localStorage.setItem(
              "role",
              res.data.user.role_id === 1
                ? "Talent"
                : res.data.user.role_id === 2
                ? "Supervisor"
                : "HRD"
            );
            localStorage.setItem("division", res.data.user.division);
            const tokenData = {
              user_id: res.data.user.user_id,
              fb_token: localStorage.getItem("fbToken"),
            };
            MatrixService.saveToken(tokenData).then((res) => {
              if (res.status === 200) {
                router.push("/dashboard");
                Toast.fire({
                  type: "success",
                  title: "Login in successfully",
                });
              }
            });
          } else {
            Toast.fire({
              type: "error",
              title: res.data.message,
            });
          }
          this.loading = false;
        }
      });
    },
    onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      var token = googleUser.getAuthResponse().id_token;

      localStorage.setItem("token", token);
      localStorage.setItem("email", profile.getEmail());
      this.loginByEmail();
    },
    loginByEmail() {
      MatrixService.readEmail(localStorage.getItem("email")).then((res) => {
        if (res.data[0].email === localStorage.getItem("email")) {
          localStorage.setItem("sessionToken", localStorage.getItem("token"));
          localStorage.setItem("userId", res.data[0].user_id);
          localStorage.setItem("fullName", res.data[0].name);
          localStorage.setItem(
            "role",
            res.data[0].role_id === 1
              ? "Talent"
              : res.data[0].role_id === 2
              ? "Supervisor"
              : "HRD"
          );
          localStorage.setItem("division", res.data[0].division);
          const tokenData = {
            user_id: res.data[0].user_id,
            fb_token: localStorage.getItem("fbToken"),
          };
          MatrixService.saveToken(tokenData).then((res) => {
            if (res.status === 200) {
              router.push("/dashboard");
              Toast.fire({
                type: "success",
                title: "Login in successfully",
              });
            }
          });
        } else {
          Toast.fire({
            type: "error",
            title: "Email doesn't registered",
          });
        }
      });
    },
  },
};
</script>

<template>
  <v-content>
    <v-img
      src="../../assets/bg.jpg"
      lazy-src="../../assets/bg.jpg"
      class="bg"
    />
    <v-card class="login-card card-zoom">
      <v-flex style="align-self: center">
        <p class="login-title">Log In</p>
        <v-form v-on:submit.prevent="doLogin" v-model="valid" lazy-validation>
          <v-card-text style="padding: 0px">
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
              color="#7E3105"
              class="user-input"
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
              color="#7E3105"
              class="pass-input"
            ></v-text-field>
            <br />
            <v-flex text-right class="forgot">
              <a href style="font-style: italic; color: #c4c4c4"
                >Forgot password?</a
              >
            </v-flex>
            <br />
            <v-flex style="align-self: center">
              <v-btn
                name="login"
                large
                dark
                class="login-button"
                color="#ED960B"
                type="submit"
                :loading="loading"
                >Login</v-btn
              >
            </v-flex>
          </v-card-text>
        </v-form>
        <v-flex style="align-self: center">
          <GoogleLogin
            id="google-button"
            :params="params"
            :onSuccess="onSignIn"
          >
            <v-icon left style="color: white">mdi-google</v-icon>
            SIGN IN WITH GOOGLE
          </GoogleLogin>
        </v-flex>
      </v-flex>
    </v-card>
    <v-img
      src="../../assets/logo-79.png"
      lazy-src="../../assets/logo-79.png"
      class="bg-logo"
    />
    <h3 style="margin-left: 225px; margin-top: 50px">
      Welcome
      <h3>
        to
        <h2>79 Leave Management</h2>
      </h3>
    </h3>
  </v-content>
</template>

<style scoped>
h1 {
  font-size: 42px;
  color: #7e3105;
  margin: auto;
  text-align: center;
}

h2 {
  position: absolute;
  font-size: 42px;
  font-weight: 600;
  white-space: nowrap;
  color: #ed960b;
  margin-top: -60px;
  margin-left: 50px;
}

h3 {
  position: absolute;
  font-size: 36px;
  font-weight: 300;
  color: #c4c4c4;
}

.login-title {
  font-size: 42px;
  font-weight: 600;
  color: #7e3105;
  margin: auto;
  text-align: center;
  margin-top: 55px;
}

.bg {
  position: absolute;
  width: 101%;
  height: 100%;
  left: -2px;
}

.bg-logo {
  position: absolute;
  height: 146.43px;
  width: 200px;
  margin-left: 190px;
  margin-top: 35px;
}

.login-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;

  width: 600px;
  height: 600px;

  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.25);
}

.user-input {
  margin-top: 60px;
  margin-left: 125px;
  width: 350px;
  border-radius: 10px;
  background-color: #efefef;
  height: 56px;
  outline: none;
}

.pass-input {
  margin-top: 40px;
  margin-left: 125px;
  width: 350px;
  border-radius: 10px;
  background-color: #efefef;
  height: 56px;
}

.login-button {
  width: 350px;
  height: 80px;
  margin-top: 35px;
  margin-left: 125px;
  border-radius: 10px;

  font-size: 16px;
  font-weight: 600;
}

.forgot {
  margin-right: 140px;
  margin-top: -10px;
}

#google-button {
  width: 350px;
  height: 40px;
  margin-top: 15px;
  margin-left: 125px;
  border-radius: 10px;

  background-color: lightseagreen;
  color: white;

  font-size: 16px;
  font-weight: 600;
}

.card-zoom {
  zoom: 100%;
}

@media only screen and (width: 1440px) {
  .bg-logo {
    position: absolute;
    height: 95.18px;
    width: 130px;
    margin-left: 210px;
    margin-top: 45px;
  }

  .login-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    align-items: center;

    width: 450px;
    height: 450px;

    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.25);
  }

  .card-zoom {
    zoom: 90%;
  }

  .user-input {
    margin-top: 30px;
    margin-left: 75px;
    width: 300px;
    border-radius: 10px;
    background-color: #efefef;
    height: 56px;
    outline: none;
  }

  .pass-input {
    margin-top: 30px;
    margin-left: 75px;
    width: 300px;
    border-radius: 10px;
    background-color: #efefef;
    height: 56px;
  }

  .login-button {
    width: 300px;
    height: 80px;
    margin-top: 15px;
    margin-left: 75px;
    border-radius: 10px;

    font-size: 16px;
    font-weight: 600;
  }

  .forgot {
    margin-right: 90px;
    margin-top: -20px;
  }

  .login-title {
    font-size: 42px;
    font-weight: 600;
    color: #7e3105;
    margin: auto;
    text-align: center;
    margin-top: 45px;
  }

  h1 {
    font-size: 36px;
    color: #7e3105;
    margin: auto;
    text-align: center;
  }

  h2 {
    position: absolute;
    font-size: 36px;
    font-weight: 600;
    white-space: nowrap;
    color: #ed960b;
    margin-top: -50px;
    margin-left: 30px;
  }

  h3 {
    position: absolute;
    font-size: 28px;
    font-weight: 300;
    color: #c4c4c4;
  }

  #google-button {
    width: 300px;
    height: 40px;
    margin-top: 10px;
    margin-left: 75px;
    border-radius: 10px;

    font-size: 16px;
    font-weight: 600;
  }
}

@media only screen and (width: 1366px) {
  .card-zoom {
    zoom: 70%;
  }
}
</style>
