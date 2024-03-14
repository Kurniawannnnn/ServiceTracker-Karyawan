const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pdRoute = require('./routes/pd.route');
const psRoute = require('./routes/ps.route');
const pnRoute = require('./routes/pn.route');
const raporRoute = require('./routes/rapor.route');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const getraporRoute = require('./routes/get.route');
const kpiRoute = require('./routes/kpi.route');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(pdRoute);
app.use(psRoute);
app.use(pnRoute);
app.use(authRoute)
app.use(raporRoute);
app.use(userRoute);
app.use(getraporRoute);
app.use(kpiRoute);
app.use(express.static(__dirname))

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});