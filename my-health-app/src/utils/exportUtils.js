import jsPDF from "jspdf";
import "jspdf-autotable";

// Export to CSV function
export function exportToCSV(data, filename) {
  const csvContent = data.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Export to PDF function
export function exportToPDF(data, filename) {
  const doc = new jsPDF();
  doc.text("User Data", 10, 10);

  doc.autoTable({
    head: [["Name", "Email", "Role"]],
    body: data.map((row) => [row.name, row.email, row.role]),
  });

  doc.save(filename);
}
