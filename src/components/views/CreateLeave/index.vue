<script>
import { MatrixService } from "../../../service";
import moment from "moment";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-right",
  showConfirmButton: false,
  timer: 3000,
});

export default {
  name: "CreateLeave",
  props: {
    currentLeave: Number,
    items: Object,
    mode: String,
    fullName: String,
    division: String,
  },
  data() {
    return {
      dataCuti: [],
      dateNow: new Date(),
      date1: false,
      date2: false,
      valid: true,

      name: this.fullName,
      divisi: this.division,
      leaveType: 1,
      startDate: this.mode === "Edit" ? this.items.startDate : "",
      endDate: this.mode === "Edit" ? this.items.endDate : "",
      address: this.mode === "Edit" ? this.items.address : "",
      phone: this.mode === "Edit" ? this.items.phone : "",
      reasons: this.mode === "Edit" ? this.items.reason : "",
      substituteName: this.mode === "Edit" ? this.items.replacementId : "",
      leaveId: null,

      min: moment(new Date().setDate(new Date().getDate() + 1)).format(
        "YYYY-MM-DD"
      ),
      leaveItems: [{ key: 1, name: "Cuti Tahunan" }],
      substituteNameItems: [],
    };
  },
  created() {
    console.log("cek current leave : ", this.currentLeave);
    this.getLovSubstitute();
    this.getLeaveId();
  },
  methods: {
    getLeaveId() {
      let userLeaveId = [];
      MatrixService.getAllowance().then((res) => {
        if (res.data) {
          res.data.map((item) => {
            if (item.user_id == localStorage.getItem("userId")) {
              userLeaveId.push(item.leave_id);
            }
          });
          this.leaveId = userLeaveId[0];
        }
      });
    },
    getLovSubstitute() {
      let tempLov = [];
      MatrixService.getLovSubstitute().then((res) => {
        if (res.data) {
          res.data.map((item) => {
            if (item.user_id !== parseInt(localStorage.getItem("userId"))) {
              tempLov.push({
                key: item.user_id,
                name: `${item.name} - ${item.division}`,
              });
            }
          });
          this.substituteNameItems = tempLov;
        }
      });
    },
    validate() {
      this.$refs.form.validate();
    },
    submit() {
      const {
        name,
        startDate,
        endDate,
        address,
        phone,
        reasons,
        substituteName,
        leaveId,
      } = this;
      if (this.$refs.form.validate()) {
        if (this.currentLeave <= 0) {
          Swal.fire("Information!", "The rest of your leave request has expired!", "info");
        } else {
          let data = {
            user_id: parseInt(localStorage.getItem("userId")),
            name: name,
            type: "Cuti Tahunan",
            created_by: name,
            modified_by: name,
            start_date: startDate.concat("T00:00:00Z"),
            end_date: endDate.concat("T00:00:00Z"),
            descpription: reasons,
            replacement_id: substituteName.key,
            address: address,
            phone: phone,
            status: "Draft",
            leave_id: this.mode === "Create" ? leaveId : this.items.leaveId,
          };
          if (this.mode === "Edit") {
            data.form_id = this.items.formId;
          }
          if (this.mode === "Create") {
            Swal.fire({
              title: "Confirm!",
              text: "Are you sure you want to create this leave?",
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
                MatrixService.createCuti(data).then((res) => {
                  if (res.data) {
                    if (res.data.code == 200) {
                      Toast.fire({
                        type: "success",
                        title: "Data saved successfully",
                      });
                      this.$emit("loadListCuti", true);
                      this.closeDialog();
                    } else {
                      Toast.fire({
                        type: "Failed",
                        title: "Data failed to save",
                      });
                    }
                  }
                });
              }
            });
          } else {
            Swal.fire({
              title: "Confirm!",
              text: "Are you sure you want to update this leave?",
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
                MatrixService.updateCuti(data).then((res) => {
                  if (res.data) {
                    if (res.data.code == 200) {
                      Toast.fire({
                        type: "success",
                        title: "Data saved successfully",
                      });
                      this.$emit("loadListCuti", true);
                      this.closeDialog();
                    }
                  } else {
                    Toast.fire({
                      type: "success",
                      title: "Data saved successfully",
                    });
                  }
                });
              }
            });
          }
        }
      }
    },
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    clear() {
      this.leaveType = { key: 1, name: "Cuti Tahunan" };
      this.startDate = "";
      this.endDate = "";
      this.address = "";
      this.phone = "";
      this.reasons = "";
      this.substituteName = "";
    },
  },
};
</script>

<template>
  <v-container>
    <v-form style="zoom: 80%" ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col md="8" offset-md="2">
          <v-row>
            <v-col md="6">
              <v-text-field
                v-model="name"
                label="Fullname *"
                :rules="[(v) => !!v || 'Fullname is required']"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="divisi"
                label="Division *"
                :rules="[(v) => !!v || 'Division is required']"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col md="8">
              <v-select
                name="leaveType"
                v-model="leaveType"
                :items="leaveItems"
                label="Leave Type *"
                :rules="[(v) => !!v || 'Leave Type is required']"
                item-text="name"
                item-value="key"
                outlined
                required
                return-object
              ></v-select>
            </v-col>
            <v-col md="6">
              <v-menu
                v-model="date1"
                ref="date1"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    name="startDateText"
                    v-model="startDate"
                    v-on="on"
                    label="Start Date *"
                    :rules="[(v) => !!v || 'Start Date is required']"
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker
                  name="startDate"
                  v-model="startDate"
                  :min="this.min"
                  @input="date1 = false"
                  no-title
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="6">
              <v-menu
                v-model="date2"
                ref="date2"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    name="endDateText"
                    v-model="endDate"
                    v-on="on"
                    label="End Date *"
                    :rules="[(v) => !!v || 'End Date is required']"
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker
                  name="endDate"
                  v-model="endDate"
                  :min="this.startDate"
                  @input="date2 = false"
                  no-title
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="12">
              <v-textarea
                name="address"
                v-model="address"
                label="Address During Leave *"
                :rules="[(v) => !!v || 'Address During Leave is required']"
                outlined
                required
              ></v-textarea>
            </v-col>
            <v-col md="8">
              <v-text-field
                name="phone"
                v-model="phone"
                label="Contact Number During Leave *"
                :rules="[
                  (v) => !!v || 'Contact Number During Leave is required',
                ]"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col md="12">
              <v-text-field
                name="reasons"
                v-model="reasons"
                label="Leave Reasons *"
                :rules="[(v) => !!v || 'Leave Reasons is required']"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col md="8">
              <v-select
                name="substituteName"
                v-model="substituteName"
                :items="substituteNameItems"
                label="Substitute Name During Leave *"
                :rules="[
                  (v) => !!v || 'Substitute Name During Leave is required',
                ]"
                item-text="name"
                item-value="key"
                outlined
                required
                return-object
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row style="margin-bottom: 20px">
        <v-col md="4" offset-md="2">
          <v-btn
            name="submit"
            color="green"
            class="mr-4"
            @click="submit"
            style="color: white"
          >
            submit
          </v-btn>
          <v-btn name="clear" color="cyan" @click="clear" style="color: white">
            clear
          </v-btn>
        </v-col>
        <v-col name="close" md="4" style="text-align: right">
          <v-btn color="pink" @click="closeDialog" style="color: white">
            close
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>