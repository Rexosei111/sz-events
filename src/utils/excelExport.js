import * as XLSX from "xlsx";

export const exportToExcel = async (data, fileName) => {
  try {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "attendance");
    XLSX.writeFile(wb, fileName);
    // saveAs(blob, `${event?.name}_attendance.xlsx`);
  } catch (error) {
    console.log(error);
  }
};
