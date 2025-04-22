const corsAnywhere = require('cors-anywhere');
const host = '0.0.0.0';
const port = 8080;

corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'accept-encoding']
}).listen(port, host, () => {
  console.log(`CORS Anywhere is running on http://${host}:${port}`);
});
