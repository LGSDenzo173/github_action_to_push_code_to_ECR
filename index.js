const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

const path = require('path');

// middleware 
const authAdmin = require("./middleware/auth");

// const auth_data = require('./middleware/basic-auth');
const sankeyData = require('./routes/getallsankeys')
const GetAllsankeyValues = require('./routes/getsankeyvalues')
const users = require('./routes/users');
const auth = require('./routes/auth');
const forgot = require('./routes/forgot');
const edit = require('./routes/edit');
const reset = require('./routes/reset');
const energybalance = require('./routes/energyBalance');
const testEnergy = require('./routes/testEnergy');
const Emission = require('./routes/Emission');
const countries = require('./routes/countries');
const mapper = require('./routes/mapper');
const getnodes = require('./routes/getnodes');
const deletenode = require('./routes/deletenode');
const addnode = require('./routes/addingnode');
const savesankey = require('./routes/savesankey');
const readysankeys = require("./routes/getreadysankeys")
const readysankeydata = require("./routes/readySankeyData")
const publisheddata = require("./routes/ispublished")
const getsankey = require('./routes/getsankey');
const getmembersankey = require('./routes/getmembersankeys')
const updatenode = require('./routes/editnode');
const deletesankey = require('./routes/deletesankey');
const getscale = require('./routes/getscale');
const editscale = require('./routes/editscale');
const emissionsankey = require("./routes/emissionsankey")


// Checking if JWT Key exists
if (!process.env.jwtPrivateKey) {
    console.log("FATAL ERROR: JWT (Token) Private Key not defined.");
    process.exit(1);
}

// Serve static files
app.use(express.static(path.join(__dirname, "public")));   // Uncomment before deployment AND after adding build

app.use('/flags', express.static('public/flags'));
app.use('/pics', express.static('public/profile'));
app.use('/nodes', express.static('public/nodes'));
app.use('/excel', express.static('public/mappersFiles', {
    setHeaders: (res, filePath) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Expose-Headers', '*');
    }
}));


// Allow cross-origin resourse sharing
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', '*');
    next();
});

// Fetching data in JSON format
app.use(express.json());

// Handle authentication
app.use('/users', users);
app.use('/auth', auth);
app.use('/forgot', forgot);
app.use('/reset_password', reset);
app.use('/edit_profile', edit);


/* Mapper APIs */
app.use('/mapper', mapper);

/* Nodes APIs */
app.use('/getnodes', getnodes);
app.use('/setnode', addnode);
app.use('/deletenode', deletenode);
app.use('/editnode', authAdmin, updatenode);

// Fetch data for countries
app.use('/countries', countries);

// Fetch data for Energy Balance sheet 
app.use('/energybalance', testEnergy);

// Sankey data
app.use('/savesankey', authAdmin, savesankey)  // Save
app.use('/getsankey', authAdmin, getsankey);   // Load

//GetallSankeyData
app.use('/getsankeyvalues', authAdmin, GetAllsankeyValues);   // Load

// Fetch Sankey data
app.use('/getallsankeys', authAdmin, sankeyData); // Fetch
app.use('/getmembersankey', authAdmin, getmembersankey); // Fetch

// Fetch readySankeys data
app.use('/sankeyread', readysankeys); // update

// Fetch readySankeys data
app.use('/publishedata', publisheddata); // update

// Fetch readySankeys data
app.use('/sankeypublished', authAdmin, readysankeydata); // update

// Delete Sankey data
app.use('/deletesankey', authAdmin, deletesankey); // Fetch

// Flow scales
app.use('/editscale', authAdmin, editscale);
app.use('/getscale', getscale);

// Test APIS
app.use('/testEmission', Emission);
app.use('/testEnergy', energybalance);
app.use('/emissionsankey', emissionsankey);


//commenting 
// Making application production ready
// require('./config/prod')(app);  // Uncomment before deployment

// Default route
app.get("*", (req, res) => {
    return res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Connect to port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening at port ${port}`));