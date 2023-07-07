const express = require('express');
const app = express();

app.use(require('cors')())

// Middleware to handle subdomain routing
app.use((req, res, next) => {
  const host = req.headers.host;
  const subdomain = host.split('.')[0];

  if (subdomain === 'dog') {
    // Routes for abc.example.com
    require('./routes/dog')(req, res, next);
  } else {
    // Routes for example.com
    require('./routes/main')(req, res, next);
  }
});

// ---------------------------------

let status = {
    mode: "awake",
    direction: "stopped",
    message: ":)"
}

// Update response message based on user input
app.post('/updateStatus', (req, res) => {
  console.log(req.body);
  const newMessage = req.body; // Assuming the user input is sent in the 'message' field
  status = {
    ...status,
    ...newMessage
  }
  res.send('Status updated successfully.');
});


const http = require('http').Server(app);

const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('A client connected.');

  // Receive messages from the ROBOT
  socket.on('client-message', (message) => {
    console.log('Received from client:', message);
    socket.emit('server-message', status);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});

http.listen(4000, () => {
  console.log('Server listening on port 4000.');
});

// ---------------------

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const sharedKey = '9f88303ad5349043bbc620f3705ef58a4cb67c43866853d8a9d321a983708bc8'; // Shared key between server and client

router.use(express.json());

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// router.post('/data-stream', (req, res) => {

//   const encryptedData = req.body.data;
//   const signature = req.body.signature;
//   // Verify the signature
//   const decryptedSignature = decrypt(signature, sharedKey);
//   const decryptedData = decrypt(encryptedData, sharedKey);
//   console.log(decryptedSignature + "\t->\t" + decryptedData);
//   if (decryptedSignature === 'valid') {
//     res.status(200).send('Data received and processed.');
//   } else {
//     res.status(401).send('Invalid signature.');
//   }
// });

// // Decrypt function
// function decrypt(text, key) {
//   const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, "hex"), Buffer.alloc(16, 0));
//   decipher.setAutoPadding(true)

//   let decrypted = decipher.update(text, 'hex', 'utf-8');
//   decrypted += decipher.final('utf-8');
//   return decrypted;
// }


router.use(express.static('public'))

router.get('/', (req, res) => {
  res.render('dog/main.ejs');
});

router.get('/dogcontrol', (req, res) => {
  res.render('dog/control2.ejs');
});

// router.get('')


module.exports = router;