<script>
import { MatrixService } from "../../../service";
import Swal from "sweetalert2";
import moment from "moment";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
});
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

export default {
  name: "Home",
  data: () => ({
    search: "",
    page: 1,
    itemsPerPage: 10,
    columns: dummyData.columns,
    dataCuti: [],
    expanded: [],
    singleExpand: false,
  }),
  created() {
    this.getListCuti();
  },
  methods: {
    getListCuti() {
      let dataTemp = [];
      MatrixService.getCuti().then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status !== "Draft") {
            dataTemp.push({
              form_id: res.data[i].form_id,
              user_id: res.data[i].user_id,
              name: res.data[i].name,
              type: res.data[i].type,
              created_by: res.data[i].created_by,
              modified_by: res.data[i].modified_by,
              created_date: moment(res.data[i].created_date).format(
                "YYYY-MM-DD"
              ),
              last_modified_date: moment(res.data[i].last_modified_date).format(
                "YYYY-MM-DD"
              ),
              start_date: moment(res.data[i].start_date).format("YYYY-MM-DD"),
              end_date: moment(res.data[i].end_date).format("YYYY-MM-DD"),
              leave_duration: parseInt(res.data[i].leave_duration) + 1,
              description: res.data[i].descpription,
              replacement_id: res.data[i].replacement_id,
              replacement_name: res.data[i].replacement_name,
              address: res.data[i].address,
              phone: res.data[i].phone,
              status: res.data[i].status,
              leave_id: res.data[i].leave_id,
              current_leave: res.data[i].current_leave,
            });
            this.dataCuti = dataTemp;
          }
        }
      });
    },
    approveCuti(item) {
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
          MatrixService.approvedBySpv(data).then((res) => {
            if (res.data) {
              if (res.data.code == 200) {
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
                            message:
                              "Your leave request is being forwarded to HRD",
                          },
                        };
                        MatrixService.sendFCM(fcmData);
                      }
                    });
                  }
                });
                this.dataCuti = [];
                this.getListCuti();
              } else {
                Toast.fire({
                  type: "Failed",
                  title: "Data failed to approve",
                });
              }
            }
          });
        }
      });
    },
    rejectCuti(item) {
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
          MatrixService.rejectedBySpv(data).then((res) => {
            if (res.data) {
              if (res.data.code == 200) {
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
                              "Sorry, your leave request has been Rejected by SPV",
                          },
                        };
                        MatrixService.sendFCM(fcmData);
                      }
                    });
                  }
                });
                this.dataCuti = [];
                this.getListCuti();
              } else {
                Toast.fire({
                  type: "Failed",
                  title: "Data failed to approve",
                });
              }
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
          <h2>SUPERVISOR - Request Lists</h2>
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
                    name="searchOnSpv"
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
              sort-by="created_date"
              :sort-desc="true"
            >
              <template v-slot:[`item.actions`]="{ item }" :name="item.name">
                <v-row>
                  <v-btn
                    :name="`approve${item.name}`"
                    color="success"
                    elevation="2"
                    small
                    @click="approveCuti(item)"
                    :disabled="item.status.toLowerCase() !== 'open'"
                  >
                    <h6>Approve</h6>
                  </v-btn>
                  <v-divider class="mx-1" vertical />
                  <!-- <v-spacer/> -->
                  <v-btn
                    :name="`reject${item.name}`"
                    color="error"
                    elevation="2"
                    small
                    @click="rejectCuti(item)"
                    :disabled="item.status.toLowerCase() !== 'open'"
                  >
                    <h6>REJECT</h6>
                  </v-btn>
                </v-row>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <br />
                  <h4>Address During Leave</h4>
                  <p>{{ item.address }}</p>
                  <h4>Replacer:</h4>
                  <p>{{ item.replacement_name }}</p>
                  <h4>Reason:</h4>
                  <p>{{ item.description }}</p>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>