const app = require('./server');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('started server on port %d', port);
})
