function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function login(username, password) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Login');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username && data[i][1] === password) {
      return {
        status: 'success',
        userType: data[i][2]  // Assuming the userType is in the third column
      };
    }
  }
  return {
    status: 'failure',
    message: 'Invalid username or password'
  };
}

function getDashboardData(username) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dashboard');
  const data = sheet.getDataRange().getValues();
  if (isAdmin(username)) {
    return data.slice(1);  // Return all data for Admin, excluding the header
  }
  const userOrders = data.filter((row, index) => index > 0 && row[0] === username);  // Return data matching username for other users, excluding header
  return userOrders;
}

function getSubmitOrdersData(username) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  
  if (isAdmin(username)) {
    return data.slice(1);  // Return all data for Admin, excluding the header
  }

  const userOrders = data.filter((row, index) => index > 0 && row[0] === username);  // Check username in column A (index 0)
  return userOrders;
}

function getDetailsData(username, userType) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Details');
  const data = sheet.getDataRange().getValues();
  if (userType === 'Admin') {
    return data.slice(1);  // Return all data for Admin, excluding header
  }
  const userDetails = data.filter((row, index) => index > 0 && row[0] === username);  // Return data matching username for other users, excluding header
  return userDetails;
}

function submitOrder(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
    const lastRow = sheet.getLastRow();
    const serialNumber = lastRow; // Auto serial number based on last row number
    const rowData = [data.username, serialNumber, ...data.orderData];
    sheet.appendRow(rowData);
    return {
      status: 'success'
    };
  } catch (e) {
    return {
      status: 'error',
      message: 'Error submitting order: ' + e.message
    };
  }
}

function isAdmin(username) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Login');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username && data[i][2] === 'Admin') {
      return true;
    }
  }
  return false;
}
