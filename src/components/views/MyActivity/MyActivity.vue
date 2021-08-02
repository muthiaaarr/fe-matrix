<script>
import { MatrixService } from "../../../service";
import CreateLeave from "../CreateLeave";
import Swal from "sweetalert2";
import moment from "moment";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-right",
  showConfirmButton: false,
  timer: 3000,
});

const dummyData = {
  columns: [
    { text: "Submission Date", value: "createdDate" },
    { text: "Leave Type", value: "leaveType" },
    { text: "Start Date", value: "startDate" },
    { text: "End Date", value: "endDate" },
    { text: "Duration", value: "duration" },
    { text: "Status", value: "status" },
    { text: "Actions", value: "actions" },
  ],
};

export default {
  name: "MyActivity",
  components: { CreateLeave },
  data: () => ({
    fullName: localStorage.getItem("fullName"),
    division: localStorage.getItem("division"),
    dataEdit: null,
    dialog: false,
    search: "",
    page: 1,
    itemsPerPage: 10,
    columns: dummyData.columns,
    dataCuti: [],
    dialogDelete: false,
    expanded: [],
    singleExpand: true,
    mode: "Create",
  }),
  created() {
    this.getListCuti();
    this.getAlluser();
  },
  methods: {
    getListCuti() {
      let tempData = [];
      MatrixService.getCuti().then((res) => {
        if (res.data) {
          res.data.map((item) => {
            if (item.user_id == parseInt(localStorage.getItem("userId"))) {
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
                leaveId: item.leave_id,
                formId: item.form_id,
                currentLeave: item.current_leave
              });
            }
          });
          this.dataCuti = tempData;
          console.log('current leave 1 : ', tempData[0].currentLeave)
        }
      });
    },
    editItem(item) {
      this.dialog = true;
      this.dataEdit = item;
      this.mode = "Edit";
    },

    deleteItem(item) {
      this.editedIndex = this.dataCuti.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.dataCuti.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    doRefresh() {
      this.dialog = false;
      this.dataCuti = [];
      this.mode = "Create";
    },
    deleteAlert(item) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        focusConfirm: false,
        focusCancel: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteDataCuti(item.id);
        } else {
          Swal.fire("Cancelled", "Your file is still intact", "info");
        }
      });
    },
    sendLeave(item) {
      const data = {
        form_id: item.id,
      };
      Swal.fire({
        title: "Are you sure to send this leave?",
        text:
          "You can still cancel this leave request when the status is Open!",
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
          MatrixService.sendLeaveRequest(data).then((res) => {
            if (res.data) {
              if (res.data.code == 200) {
                Toast.fire({
                  type: "success",
                  title: "Data sent successfully",
                });
                for (let i = 0; i < this.dataUser.length; i++) {
                  if (this.dataUser[i].role === 2) {
                    const fcmData = {
                      to: this.dataUser[i].token,
                      data: {
                        username: "New Update Available",
                        message: this.fullName + " has requested a leave",
                      },
                    };
                    MatrixService.sendFCM(fcmData);
                  }
                }
                this.dataCuti = [];
                this.getListCuti();
              } else {
                Toast.fire({
                  type: "Failed",
                  title: "Data failed to sent",
                });
              }
            }
          });
        }
      });
    },
    cancelLeave(item) {
      const data = {
        form_id: item.id,
      };
      Swal.fire({
        title: "Are you sure to cancel this leave?",
        text: "You won't be able to revert this!",
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
          MatrixService.cancelLeaveRequest(data).then((res) => {
            if (res.data) {
              if (res.data.code == 200) {
                Toast.fire({
                  type: "success",
                  title: "Data has been successfully canceled",
                });
                this.dataCuti = [];
                this.getListCuti();
              } else {
                Toast.fire({
                  type: "Failed",
                  title: "Data failed canceled",
                });
              }
            }
          });
        }
      });
    },
    deleteDataCuti(id) {
      MatrixService.deleteCuti(id).then((res) => {
        if (res.data) {
          this.getListCuti();
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    },
    getAlluser() {
      let tempData = [];
      MatrixService.getLovSubstitute().then((res) => {
        if (res.data) {
          res.data.map((item) => {
            tempData.push({
              id: item.user_id,
              token: item.fb_token,
              role: item.role_id,
            });
          });
          this.dataUser = tempData;
        }
      });
    },
  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialog(event) {
      event || this.getListCuti();
    },
  },
};
</script>

<template>
  <v-container>
    <!-- <v-layout wrap>
      <v-row>
        <v-col md="8">
          <h2>My Activity</h2>
        </v-col>
      </v-row>
    </v-layout>
    <br />
    <v-row>
      <v-col md="4">
        <h3>Leaves Available</h3>
        <h1 style="color: orange">10 Days</h1>
      </v-col>
      <v-col md="4">
        <h3>Leaves Taken</h3>
        <h1 style="color: orange">1 Days</h1>
      </v-col>
    </v-row>
    <br /> -->
    <v-layout wrap>
      <v-row>
        <v-col md="8">
          <h2>MY ACTIVITY</h2>
        </v-col>
      </v-row>
    </v-layout>
    <br />
    <v-layout wrap>
      <v-row>
        <v-col md="12">
          <v-card>
            <v-card-title>
              <v-col md="4">
                <v-text-field
                  name="searchActivity"
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  color="#262125"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" width="50%" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    name="createLeave"
                    depressed
                    style="background: orange; color: white; margin-top: 20px"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-plus</v-icon> Create Leave
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    style="
                      background-color: #091f43;
                      color: white;
                      margin-bottom: 20px;
                    "
                  >
                    <span class="headline">{{ mode }} Leave</span>
                  </v-card-title>
                  <CreateLeave
                    v-if="dialog"
                    @loadListCuti="doRefresh"
                    @closeDialog="dialog = false"
                    :currentLeave="dataCuti[0].currentLeave"
                    :items="dataEdit"
                    :mode="mode"
                    :fullName="fullName"
                    :division="division"
                  />
                </v-card>
              </v-dialog>
            </v-card-title>
            <v-data-table
              :headers="columns"
              :items="dataCuti"
              :search="search"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              item-key="id"
              show-expand
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      :name="`deleteButton${item.id}`"
                      small
                      class="mr-2"
                      @click="deleteAlert(item)"
                      v-bind="attrs"
                      v-on="on"
                      color="red"
                      :disabled="item.status !== 'Draft'"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      :name="`cancelButton${item.id}`"
                      small
                      class="mr-2"
                      @click="cancelLeave(item)"
                      v-bind="attrs"
                      v-on="on"
                      color="orange"
                      :disabled="item.status !== 'Open'"
                    >
                      mdi-undo-variant
                    </v-icon>
                  </template>
                  <span>Cancel</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      :name="`editButton${item.id}`"
                      small
                      class="mr-2"
                      color="green"
                      :disabled="item.status !== 'Draft'"
                      @click="editItem(item)"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Edit</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      :name="`sendButton${item.id}`"
                      small
                      class="mr-2"
                      @click="sendLeave(item)"
                      v-bind="attrs"
                      v-on="on"
                      color="blue"
                      :disabled="item.status !== 'Draft'"
                    >
                      mdi-send
                    </v-icon>
                  </template>
                  <span>Send</span>
                </v-tooltip>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
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
                      <p>{{ item.lastModifiedDate }}</p>
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
</style>