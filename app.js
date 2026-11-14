const express = require('express');
const os = require('os');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve the HTML page from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Live security facts about the running container (no secret values are ever returned)
app.get('/api/security', (req, res) => {
  res.json({
    pod: os.hostname(),
    runningAsUid: typeof process.getuid === 'function' ? process.getuid() : 'n/a',
    nonRoot: typeof process.getuid === 'function' ? process.getuid() !== 0 : null,
    dbPasswordLoadedFromSecret: Boolean(process.env.DB_PASSWORD),
    nodeVersion: process.version
  });
});

app.listen(PORT, () => console.log(`Healthcare portal running on port ${PORT}`));
