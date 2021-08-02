<script>
import router from "./../../router/routes";
import firebase from "../../firebase";
import NotificationBox from "../layouts/NotificationBox";
import moment from "moment";
import { MatrixService } from "../../service";

const accessMenu = {
  Talent: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "mdi-view-dashboard",
    },
    {
      name: "My Activity",
      path: "/my-activity",
      icon: "mdi-calendar-text",
    },
  ],
  Supervisor: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "mdi-view-dashboard",
    },
    {
      name: "My Activity",
      path: "/my-activity",
      icon: "mdi-calendar-text",
    },
    {
      name: "Supervisor",
      path: "/supervisor",
      icon: "mdi-calendar-multiple-check",
    },
  ],
  HRD: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "mdi-view-dashboard",
    },
    {
      name: "My Activity",
      path: "/my-activity",
      icon: "mdi-calendar-text",
    },
    {
      name: "Supervisor",
      path: "/supervisor",
      icon: "mdi-calendar-multiple-check",
    },
    {
      name: "HRD",
      path: "/hrd",
      icon: "mdi-calendar-multiple-check",
    },
  ],
};
export default {
  name: "Header",

  components: {
    NotificationBox,
  },

  data: () => ({
    drawers: ["Default (no property)", "Permanent", "Temporary"],
    primaryDrawer: {
      model: null,
      type: "Permanent",
      clipped: false,
      floating: false,
      mini: false,
    },
    group: null,
    listMenu: accessMenu[localStorage.getItem("role")],
    menu: false,
    message: false,
    hints: true,
    date: new Date(),
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    fullName: localStorage.getItem("fullName"),
    role: localStorage.getItem("role"),
    notification: JSON.parse(localStorage.getItem("notif")),
    dataCuti: [],
    dataUser: [],
    userId: parseInt(localStorage.getItem("userId")),
    reciever:
      "cx0rjmYSkJ1QMbce_R1MUH:APA91bGSMs6sAPjC0TKM_tSIUZo27kr0XsdX8yc8TnqRzdHUcFq1VIcWHtE6JV1MBdMuUtbUAtSgQBtCAadrMFLLOtZSQ1Kcw3NbNxNRNLogE3H3AnkI2wiodk7AUukA4srHqEmlfwY0",
  }),
  methods: {
    decrement() {
      this.$store.commit("decrement");
    },
    doLogout() {
      let fbToken = localStorage.getItem("fbToken");
      localStorage.clear();
      localStorage.setItem("fbToken", fbToken);
      router.push("/login");
    },
    getNotif() {
      const msgRef = firebase.database().ref("Message");
      msgRef.once("value", function (snapshot) {
        var messages = [];
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          var data = childSnapshot.val();

          messages.push({
            key: key,
            userId: data.userId,
            from: data.from,
            content: data.content,
            isRead: data.isRead,
          });
        });
        localStorage.setItem("notif", JSON.stringify(messages));
      });
    },
    sendFcm() {
      const data = {
        to: `${this.reciever}`,
        data: {
          username: "New Update Available",
          message: this.fullName + " mengajukan cuti",
        },
      };
      MatrixService.sendFCM(data);
    },
    getAlluser() {
      let tempData = [];
      MatrixService.getLovSubstitute().then((res) => {
        if (res.data) {
          res.data.map((item) => {
            tempData.push({
              id: item.user_id,
              name: item.name,
            });
          });
          this.dataUser = tempData;
          if (res.status === 200) {
            this.getAllCuti();
          }
        }
      });
    },
    getAllCuti() {
      let tempData = [];
      MatrixService.getCuti().then((res) => {
        if (res.data) {
          res.data.map((item) => {
            if (this.role === "Talent") {
              if (item.user_id === this.userId && item.is_read === 0) {
                for (let i = 0; i < this.dataUser.length; i++) {
                  if (item.user_id === this.dataUser[i].id)
                    tempData.push({
                      formId: item.form_id,
                      name: this.dataUser[i].name,
                      endDate: moment(item.end_date).format("YYYY-MM-DD"),
                      startDate: moment(item.start_date).format("YYYY-MM-DD"),
                      status: item.status,
                    });
                }
              }
            } else if (this.role === "Supervisor") {
              if (item.status === "Open" && item.is_read === 0) {
                for (let i = 0; i < this.dataUser.length; i++) {
                  if (item.user_id === this.dataUser[i].id)
                    tempData.push({
                      formId: item.form_id,
                      name: this.dataUser[i].name,
                      endDate: moment(item.end_date).format("YYYY-MM-DD"),
                      startDate: moment(item.start_date).format("YYYY-MM-DD"),
                      status: item.status,
                    });
                }
              }
            } else if (this.role === "HRD") {
              if (item.status === "Inprogress" && item.is_read === 0) {
                for (let i = 0; i < this.dataUser.length; i++) {
                  if (item.user_id === this.dataUser[i].id)
                    tempData.push({
                      formId: item.form_id,
                      name: this.dataUser[i].name,
                      endDate: moment(item.end_date).format("YYYY-MM-DD"),
                      startDate: moment(item.start_date).format("YYYY-MM-DD"),
                      status: item.status,
                    });
                }
              }
            }
          });
          this.dataCuti = tempData;
        }
      });
    },
    readAllNotif() {
      for (let i = 0; i < this.dataCuti.length; i++) {
        const cutiId = {
          form_id: this.dataCuti[i].formId,
        };
        if (cutiId) {
          MatrixService.readNotif(cutiId);
        }
      }
      this.dataCuti = [];
    },
    redirectTalent() {
      router.push("/my-activity");
    },
    redirectSupervisor() {
      router.push("/supervisor");
    },
    redirectHRD() {
      router.push("/hrd");
    },
  },
  computed: {
    messages() {
      return this.$store.getters.getMessages;
    },
  },

  created() {
    this.getAlluser();
    this.getNotif();
  },
};
</script>

<template>
  <div>
    <NotificationBox />
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      app
      overflow
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <div id="logo-itm" style="text-align: center; margin-top: 10%">
              <v-flex offset-md2 md8>
                <img
                  src="./../../assets/logo-79-full.png"
                  style="width: 135px"
                  alt="avatar"
                />
              </v-flex>
            </div>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list dense nav>
        <v-list-item-group
          v-model="group"
          active-class="orange--text text--accent-4"
        >
          <v-list-item
            v-for="item in listMenu"
            :key="item.name"
            link
            :to="item.path"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      extension-height="1"
      :clipped-left="primaryDrawer.clipped"
      app
      style="background-color: #262125"
    >
      <template v-slot:extension>
        <!-- <v-divider></v-divider> -->
      </template>
      <v-spacer></v-spacer>

      <!-- <v-toolbar-items v-for="(menu, i) in listMenu" :key="i">
        <v-btn text :to="menu.path">{{menu.name}}</v-btn>
      </v-toolbar-items>-->

      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-toolbar-items>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-badge color="red" overlap>
                  <template v-slot:badge>
                    <span v-if="messages > 0">!</span>
                    <!-- <span v-if="messages > 0">{{ messages }}</span> -->
                  </template>
                  <v-icon style="color: white">mdi-bell-outline</v-icon>
                </v-badge>
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-subheader>Notifications</v-subheader>
                <v-list-item-group>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="'New Message'"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider style="padding: 5px 0 3px 0"></v-divider>
                  <v-list two-line style="overflow: auto; height: 230px">
                    <template v-for="(item, index) in dataCuti">
                      <v-list-item :key="item.formId">
                        <template>
                          <v-list-item-content
                            v-if="role === 'Talent'"
                            v-on:click="redirectTalent"
                          >
                            <v-list-item-title
                              >Your leave status is "{{
                                item.status
                              }}"</v-list-item-title
                            >
                            <v-list-item-subtitle>
                              which start from
                              {{ item.startDate }}</v-list-item-subtitle
                            >
                          </v-list-item-content>
                          <v-list-item-content
                            v-else-if="role === Supervisor"
                            v-on:click="redirectSupervisor"
                          >
                            <v-list-item-title
                              >{{ item.name }} has requested a
                              Leave</v-list-item-title
                            >
                            <v-list-item-subtitle>
                              from {{ item.startDate }} until
                              {{ item.endDate }}</v-list-item-subtitle
                            >
                          </v-list-item-content>
                          <v-list-item-content v-else v-on:click="redirectHRD">
                            <v-list-item-title
                              >{{ item.name }} has requested a
                              Leave</v-list-item-title
                            >
                            <v-list-item-subtitle>
                              from {{ item.startDate }} until
                              {{ item.endDate }}</v-list-item-subtitle
                            >
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                      <v-divider
                        v-if="index < dataCuti.length - 1"
                        :key="index"
                      ></v-divider>
                    </template>
                  </v-list>
                  <v-divider
                    style="padding: 5px 0 3px 0"
                    v-if="dataCuti.length > 0"
                  ></v-divider>
                  <v-list-item
                    v-if="dataCuti.length > 0"
                    active-class="orange--text"
                    v-on:click="readAllNotif"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-content>
                        <v-list-item-title style="fontSize: 14px, height: 10px"
                          >Mark all as read</v-list-item-title
                        >
                      </v-list-item-content>
                      <v-icon v-if="!active" color="grey lighten-1">
                        mdi-check-circle-outline
                      </v-icon>

                      <v-icon v-else color="green darken-3">
                        mdi-check-circle
                      </v-icon>
                    </template>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-menu>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on" name="buttonProfile">
                <v-row align="center" class="spacer" no-gutters>
                  <v-col>
                    <v-list-item-avatar size="30" class="elevation-4">
                      <img
                        src="https://img.icons8.com/bubbles/452/system-administrator-male.png"
                        alt="Agan"
                      />
                    </v-list-item-avatar>
                  </v-col>
                  <v-col class="account-title">
                    <label>{{ fullName }}</label>
                    <v-icon small v-text="'mdi-chevron-down'"></v-icon>
                    <br />
                    <label style="font-size: 10px">{{ role }}</label>
                  </v-col>
                </v-row>
              </v-btn>
            </template>
            <v-list shaped>
              <v-list-item
                class="text-right"
                @click="doLogout()"
                name="buttonLogout"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-logout'"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="'Logout'"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </template>
    </v-app-bar>
  </div>
</template>
