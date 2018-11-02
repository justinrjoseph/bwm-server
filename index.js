const express = require('express'),
      app = express();

require('./startup/db')();
require('./startup/routes')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));