<template>
  <div>
    <h2>Interactive Table</h2>
    <table id="example" class="display" style="width: 100%">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>IP Address</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.first_name }}</td>
          <td>{{ user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.gender }}</td>
          <td>{{ user.ip_address }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import $ from "jquery";
import "datatables.net-dt"; // Import DataTables styling and functionality
import users from "@/assets/MOCK_DATA.json"; // Import mock data

export default {
  name: "DataTable",
  data() {
    return {
      users, // Populate with the imported JSON data
    };
  },
  mounted() {
    $(document).ready(function () {
      $("#example").DataTable();
    });
  },
};
</script>
