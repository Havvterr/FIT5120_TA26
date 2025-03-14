<template>
  <div class="export-container">
    <h2>Export Data</h2>
    <div class="export-buttons">
      <button @click="exportCSV">Export to CSV</button>
      <button @click="exportPDF">Export to PDF</button>
    </div>
  </div>
</template>

<script>
// Import the export functions from the utils folder with correct relative path
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

export default {
  data() {
    return {
      users: [
        { name: "Alice", email: "alice@example.com", role: "User" },
        { name: "Bob", email: "bob@example.com", role: "Admin" },
      ],
    };
  },
  methods: {
    exportCSV() {
      const csvData = [
        ["Name", "Email", "Role"],
        ...this.users.map((user) => [user.name, user.email, user.role]),
      ];
      exportToCSV(csvData, "user-data.csv");
    },
    exportPDF() {
      const pdfData = this.users.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.role,
      }));
      exportToPDF(pdfData, "user-data.pdf");
    },
  },
};
</script>

<style scoped>
.export-container {
  text-align: center;
  margin-top: 20px;
}

.export-buttons button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.export-buttons button:hover {
  background-color: #0056b3;
}
</style>
