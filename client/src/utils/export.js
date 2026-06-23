const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (rows, filename = "export.csv") => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
};

export const exportToExcel = (rows, filename = "export.xls") => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${headers.map((h) => `<td>${row[h] ?? ""}</td>`).join("")}</tr>`
    )
    .join("");
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="UTF-8"></head>
    <body>
      <table border="1">
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  downloadBlob(blob, filename);
};

export const exportToPDF = (title, contentHtml) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html><head>
      <title>${title}</title>
      <style>
        body { font-family: Poppins, sans-serif; padding: 32px; color: #0f172a; }
        h1 { font-size: 22px; margin-bottom: 8px; }
        p.meta { color: #64748b; font-size: 13px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
        th { background: #f1f5f9; }
      </style>
    </head><body>
      <h1>${title}</h1>
      <p class="meta">Generated on ${new Date().toLocaleString()}</p>
      ${contentHtml}
    </body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

export const rowsToTableHtml = (rows) => {
  if (!rows.length) return "<p>No data</p>";
  const headers = Object.keys(rows[0]);
  return `<table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows
      .map(
        (row) =>
          `<tr>${headers.map((h) => `<td>${row[h] ?? ""}</td>`).join("")}</tr>`
      )
      .join("")}</tbody>
  </table>`;
};
