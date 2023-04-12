const express = require('express');
const app = express();

const marketPlaceRoute = require('./router/marketPlaceRoutes');
const tokenRoute = require('./router/tokenRoute');

const cors = require('cors');

app.get('/', (req, res) => {
	res.send('HELLO WORLD!...');
});

/////////////////////////
//// CUSTOM MIDDLEWARE--/
/////////////////////////

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Cintent-Type, Accept'
	);
	next();
});

////////////////////
// ---ROUTE---- ////
////////////////////

app.use('/api/marketplace', marketPlaceRoute);
app.use('/api/token', tokenRoute);

app.listen(3001, () => {
	console.log('Server is running on port 3001');
});
