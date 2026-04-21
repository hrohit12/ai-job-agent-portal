/**
 * Google Apps Script Backend for TechCareer Pro Job Portal (AI Agent Optimized)
 */

const ADMIN_EMAIL = "minimindpodcasts677@gmail.com"; 
const ADMIN_PASSWORD = "hrohit12"; 
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const JOBS_SHEET = "Jobs";

function getSheet() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(JOBS_SHEET);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(JOBS_SHEET);
    sheet.appendRow(["id", "title", "company", "location", "type", "salary", "experience", "skills", "description", "applyLink", "timestamp"]);
  }
  return sheet;
}

/**
 * Helper to return JSON with correct headers
 */
function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = e.parameter.action || "getJobs";

  if (action === "getJobs") {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();

    const jobs = data.map(row => {
      let obj = {};
      headers.forEach((key, i) => obj[key] = row[i]);
      return obj;
    });

    return jsonOut({ success: true, data: jobs });
  }

  return jsonOut({ success: false, message: "Invalid action" });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ success: false, message: "Invalid JSON body" });
  }

  // Basic Auth Check
  if (body.adminEmail !== ADMIN_EMAIL || body.adminPassword !== ADMIN_PASSWORD) {
    return jsonOut({ success: false, message: "Unauthorized" });
  }
  
  if (body.action === "postJob") {
    const sheet = getSheet();

    sheet.appendRow([
      body.id,
      body.title,
      body.company,
      body.location,
      body.type,
      body.salary,
      body.experience,
      Array.isArray(body.skills) ? body.skills.join(", ") : body.skills, 
      body.description,
      body.applyLink,
      new Date()
    ]);

    return jsonOut({ success: true });
  }

  return jsonOut({ success: false, message: "Invalid action" });
}
