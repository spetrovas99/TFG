let fs = require('fs');
const path = require('path');
let express = require("express");

const PORT = 3000;
const app = express();

//app.get('/:pageCalled', (req, res) => {
//    fs.createReadStream('./build/index.html').pipe(res);
//});

app.get('/:pageCalled', function(req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'), function(err) {
  if (err) {
    res.status(500).send(err)
  }
  })
})

  app.use(express.static('./build'));

  
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });