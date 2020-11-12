const express = require('express');
const os = require('os');
const port  = process.env.PORT || 8080;
const app = express();
const http = require('http').createServer(app);
// const io = require('socket.io')(http);


app.use(express.static(path.join("dist")));

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.get("*", (req, res) => {
	res.sendFile(path.join("dist", "index.html"), {root: path.join(__dirname, "..", "..")});
});

http.listen(port, () => console.log(`Listening on port ${port}!`));
