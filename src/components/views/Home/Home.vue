<script>
import { MatrixService } from "../../../service";
import moment from "moment";

export default {
  name: "Home",
  data: () => ({
    columns: [],
    search: "",
    page: 1,
    itemsPerPage: 5,
    dataCuti: [],
    dialog: false,
    expanded: [],
    singleExpand: true,
    fullName: localStorage.getItem("fullName"),
    userId: parseInt(localStorage.getItem("userId")),
    jatahCuti: [],
    leaveTaken: 0,
  }),
  created() {
    this.createColumns();
    this.getListCuti();
    this.getJatahCuti();
  },
  methods: {
    createColumns() {
      const columnsTemp = [];
      if (localStorage.getItem("role") === "HRD") {
        columnsTemp.push({ text: "Name", value: "name" });
      }
      columnsTemp.push(
        { text: "Submission Date", value: "createdDate" },
        { text: "Leave Type", value: "leaveType" },
        { text: "Start Date", value: "startDate" },
        { text: "End Date", value: "endDate" },
        { text: "Duration", value: "duration" }
      );
      if (localStorage.getItem("role") === "HRD") {
        columnsTemp.push({ text: "Current Leave", value: "currentLeave" });
      }
      columnsTemp.push({ text: "Status", value: "status" });
      this.columns = columnsTemp;
    },
    getListCuti() {
      let tempData = [];
      let cutiById = [];
      MatrixService.getCutiUser().then((res) => {
        if (res.data) {
          res.data.map((item) => {
            if (item.user_id === this.userId) {
              cutiById.push(item);
              if (
                item.status === "Approved" ||
                item.status === "Reject by SPV" ||
                item.status === "Reject by HRD"
              ) {
                tempData.push({
                  createdDate: moment(item.created_date).format("YYYY-MM-DD"),
                  address: item.address,
                  createdBy: item.created_by,
                  reason: item.descpription,
                  endDate: moment(item.end_date).format("YYYY-MM-DD"),
                  id: item.form_id,
                  lastModifiedDate: moment(item.last_modified_date).format(
                    "YYYY-MM-DD"
                  ),
                  duration: parseInt(item.leave_duration) + 1,
                  modifiedBy: item.modified_by,
                  name: item.name,
                  phone: item.phone,
                  replacementId: item.replacement_id,
                  replacementName: item.replacement_name,
                  startDate: moment(item.start_date).format("YYYY-MM-DD"),
                  status: item.status,
                  leaveType: item.type,
                  userId: item.user_id,
                  currentLeave: item.current_leave,
                });
              }
            }
          });

          for (var i = 0; i < cutiById.length; i++) {
            this.leaveTaken = this.leaveTaken + cutiById[i].leave_duration;
            this.leaveTaken += 1;
          }
          this.dataCuti = tempData;
        }
      });
    },
    getJatahCuti() {
      let tempData = [];
      MatrixService.getJatahCutiUser().then((res) => {
        if (res.data) {
          res.data.map((item) => {
            if (item.user_id === this.userId) {
              tempData.push(item);
            }
          });
          this.jatahCuti = tempData;
        }
      });
    },
  },
};
</script>

<template>
  <v-container>
    <v-layout wrap>
      <v-row>
        <v-col md="8">
          <h2>DASHBOARD</h2>
        </v-col>
      </v-row>
    </v-layout>
    <br />
    <v-layout wrap>
      <v-row>
        <v-col md="8">
          <v-card style="background: orange; border-radius: 25px">
            <v-row>
              <v-col md="8" style="color: white">
                <v-card-text>
                  <h2>Hello, {{ fullName }}!</h2>
                  <h4>This is your remaining leaves balance</h4>
                </v-card-text>
                <v-card-text>
                  <h3>Leaves Available</h3>
                  <h1 style="color: #081e43">
                    {{
                      jatahCuti[0].current_leave + jatahCuti[0].last_year_leave
                    }}
                    Days
                  </h1>
                </v-card-text>
                <v-card-text>
                  <h3>Leaves Taken</h3>
                  <h1 style="color: #081e43">{{ leaveTaken }} Days</h1>
                </v-card-text>
                <v-img
                  src="../../../assets/illustration.svg"
                  lazy-src="../../../assets/illustration.svg"
                  class="illustration"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
    <br />
    <v-layout wrap>
      <v-row>
        <v-col md="12">
          <br />
          <h4>Leave Summary</h4>
          <v-divider />
          <br />
          <v-card>
            <v-row>
              <v-col md="4">
                <v-card-title>
                  <v-text-field
                    v-model="search"
                    name="searchSummary"
                    append-icon="mdi-magnify"
                    label="Search"
                    color="#262125"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
              </v-col>
            </v-row>
            <v-data-table
              :headers="columns"
              :items="dataCuti"
              :search="search"
              :items-per-page="itemsPerPage"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              item-key="id"
              show-expand
            >
              <template
                v-slot:expanded-item="{ headers, item }"
                :name="item.name"
              >
                <td :colspan="headers.length">
                  <br />
                  <h4>Address During Leave</h4>
                  <p>{{ item.address }}</p>
                  <h4>Reason</h4>
                  <p>{{ item.reason }}</p>
                  <h4>Replacer</h4>
                  <p>{{ item.replacementName }}</p>
                  <v-row>
                    <v-col md="2">
                      <h4>Last Updated Date</h4>
                      <p>
                        {{ item.lastModifiedDate }}
                      </p>
                    </v-col>
                    <v-col md="2">
                      <h4>Last Updated By</h4>
                      <p>{{ item.modifiedBy }}</p>
                    </v-col>
                  </v-row>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>
<style scoped>
h3 {
  padding-bottom: 10px;
}

.illustration {
  position: absolute;
  top: -45px;
  left: 400px;
}
</style>