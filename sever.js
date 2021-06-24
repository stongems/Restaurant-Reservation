let express = require("express");
let path = require("path");

//======================================= SETS UP EXPRESS APP
let app = express();
let PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// =============================================BLANK ARRAYS
let data = {
	reservations: [],
	waitlist: [],
};

let visitorCount = 0;

// =====================================REQUIRED TO HOME HTML
app.get("/", function(req, res) {

  res.sendFile(path.join(__dirname, "home.html"));
  //============================== ADDING VISITOR COUNT BY 1
  visitorCount++;
});

//=================================LINK HTML PAGE 2 (RESERVEd)
app.get("/reserve", function(req, res) {
  res.sendFile(path.join(__dirname, "reserve.html"));
});
//=====================================LINK TO PAGE 3 (TABLES)
app.get("/tables", function(req, res) {
  res.sendFile(path.join(__dirname, "tables.html"));
});

//=================================================== GET JSON
app.get("/api/tables", function(req, res) {
  res.json(data.reservations);
});
//=============================================== GET API JSON 
app.get("/api/waitlist", function(req, res) {
  res.json(data.waitlist);
});

// ============================================== GET API JSON
app.get("/api/", function(req, res) {
  res.json(data);
});
//============================================== GET API CLEAR
app.get("/api/clear", function(req, res) {
  data.reservations.length = 0;
  data.waitlist.length = 0;
  res.json(data);
});
//============================================= GET API VISITORS
app.get("/api/visitors", function(req, res) {
  res.json(visitorCount);
});
//======================================== GET API NEW TABLE DATA
app.post("/api/new", function(req, res) {
  let tableData = req.body;
  console.log(tableData);
  if (tableData && tableData.name) {
  	tableData.routeName = tableData.name.replace(/\s+/g, "").toLowerCase();
  }
  console.log(tableData);

  if (data.reservations.length < 5) {
  	data.reservations.push(tableData);
  } else {
  	data.waitlist.push(tableData);
  }
  

  res.json(tableData);
});

app.get("/api/remove/:id?", function(req, res) {
  let tableId = req.params.id;

  if (tableId) {
    console.log(tableId);
	for (let i = 0; i < data.reservations.length; i++) {
	  if (tableId === data.reservations[i].id) {
	  	data.reservations.splice(i, 1);
	  	if (data.waitlist.length > 0) {
	  		let tempTable = data.waitlist.splice(0, 1)[0];
	  		data.reservations.push(tempTable);
	  	}

	    return res.json(true);
	  }
	}
	for (let i = 0; i < data.waitlist.length; i++) {
	  if (tableId === data.waitlist[i].id) {
	  	data.waitlist.splice(i, 1);

	    return res.json(true);
	  }
	}
	return res.json(false);
  }
  return res.json(false);
});

// Start the Server
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
