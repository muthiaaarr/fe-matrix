<script>
import { MatrixService } from "../../../service";
import Swal from "sweetalert2";
import moment from "moment";

const dummyData = {
  columns: [
    { text: "Name", value: "name" },
    { text: "Start Date", value: "start_date" },
    { text: "End Date", value: "end_date" },
    { text: "Leave Type", value: "type" },
    { text: "Duration", value: "leave_duration" },
    { text: "Status", value: "status" },
    { text: "Actions", value: "actions" },
  ],
};

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
});

export default {
  name: "HRD",
  data: () => ({
    search: "",
    page: 1,
    itemsPerPage: 10,
    columns: dummyData.columns,
    dataCuti: [],
    dataAllowance: [],
    expanded: [],
    singleExpand: false,
    buttonDisabled: false,
  }),
  created() {
    this.getListCuti();
  },
  methods: {
    getListCuti() {
      MatrixService.getCuti().then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status.toLowerCase() !== "draft") {
            this.dataCuti.push({
              form_id: res.data[i].form_id,
              name: res.data[i].name,
              start_date: moment(res.data[i].start_date).format("DD-MM-YYYY"),
              end_date: moment(res.data[i].end_date).format("DD-MM-YYYY"),
              type: res.data[i].type,
              leave_duration: res.data[i].leave_duration + 1 + " day(s)",
              status: res.data[i].status,
              phone: res.data[i].phone,
              address: res.data[i].address,
              reason: res.data[i].descpription,
              replacer: res.data[i].replacement_name,
              leavesAvailable: res.data[i].current_leave,
            });
          }
        }
      });
    },
    approveLeave(item) {
      const data = {
        form_id: item.form_id,
      };
      Swal.fire({
        title: "Confirm!",
        text: "Are you sure you want to approve this leave?",
        icon: "warning",
        showCancelButton: true,
        focusConfirm: false,
        focusCancel: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          MatrixService.approvedByHRD(data).then((res) => {
            if (res.status === 200) {
              Toast.fire({
                type: "success",
                title: `${item.name}'s leave request has been approved`,
              });
              MatrixService.getLovSubstitute().then((res) => {
                if (res.data) {
                  res.data.map((user) => {
                    if (item.user_id === user.user_id) {
                      const fcmData = {
                        to: user.fb_token,
                        data: {
                          username: "New Update Available",
                          message: "Your leave request has been Approved",
                        },
                      };
                      MatrixService.sendFCM(fcmData);
                    }
                  });
                }
              });
              this.dataCuti = [];
              this.getListCuti();
            }
          });
        }
      });
    },
    rejectLeave(item) {
      const data = {
        form_id: item.form_id,
      };
      Swal.fire({
        title: "Confirm!",
        text: "Are you sure you want to reject this leave?",
        icon: "warning",
        showCancelButton: true,
        focusConfirm: false,
        focusCancel: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          MatrixService.rejectedByHRD(data).then((res) => {
            if (res.status === 200) {
              Toast.fire({
                type: "success",
                title: `${item.name}'s leave request has been rejected`,
              });

              MatrixService.getLovSubstitute().then((res) => {
                if (res.data) {
                  res.data.map((user) => {
                    if (item.user_id === user.user_id) {
                      const fcmData = {
                        to: user.fb_token,
                        data: {
                          username: "New Update Available",
                          message:
                            "Sorry, your leave request has been Rejected by HRD",
                        },
                      };
                      MatrixService.sendFCM(fcmData);
                    }
                  });
                }
              });
              this.dataCuti = [];
              this.getListCuti();
            }
          });
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
          <h2>HRD - Request Lists</h2>
        </v-col>
      </v-row>
    </v-layout>
    <br />
    <v-layout wrap>
      <v-row>
        <v-col md="12">
          <v-card>
            <v-row>
              <v-col md="4">
                <v-card-title>
                  <v-text-field
                    name="searchOnHrd"
                    v-model="search"
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
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              item-key="form_id"
              show-expand
              class="elevation-1"
            >
              <template v-slot:[`item.actions`]="{ item }" :name="item.name">
                <v-container>
                  <v-row>
                    <v-col sm="5">
                      <v-btn
                        :name="`approve${item.name}`"
                        color="success"
                        elevation="2"
                        small
                        :disabled="item.status.toLowerCase() !== 'inprogress'"
                        @click="approveLeave(item)"
                        style="margin-left: -20px"
                      >
                        <h5>Approve</h5>
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn
                        :name="`reject${item.name}`"
                        color="error"
                        elevation="2"
                        small
                        :disabled="item.status.toLowerCase() !== 'inprogress'"
                        @click="rejectLeave(item)"
                        style="margin-left: -20px"
                      >
                        <h5>Reject</h5>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <br />
                  <v-row>
                    <v-col md="2">
                      <h4>Phone:</h4>
                      <p>{{ item.phone }}</p>
                    </v-col>
                    <v-col md="6">
                      <h4>Address During Leave:</h4>
                      <p>{{ item.address }}</p>
                    </v-col>
                  </v-row>
                  <h4>Leaves Available:</h4>
                  <p>{{ item.leavesAvailable }} day(s)</p>
                  <h4>Reason:</h4>
                  <p>{{ item.reason }}</p>
                  <h4>Replacer:</h4>
                  <p>{{ item.replacer }}</p>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>