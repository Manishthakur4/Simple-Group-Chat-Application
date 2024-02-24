const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/login', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        res.send(`
            <script>
                localStorage.setItem('username', '${username}');
                window.location.href = '/';
            </script>
        `);
    } else {
        res.send('Invalid username');
    }
});

app.get('/', (req, res) => {
    fs.readFile('chat.txt', 'utf8', (err, data) => {
        if (err) throw err;
        const form = `
            <div>
                <h2>Chat History:</h2>
                <pre>${data}</pre>
            </div>
            <form method="POST" action="/send" onSubmit="document.getElementById('username').value=localStorage.getItem('username');">
                <label for="message">New Message:</label>
                <input type="text" id="message" name="message" required>
                <input type="hidden" id="username" name="username" required>
                <button type="submit">Send</button>
            </form>
        `;
        res.send(form);
    });
});

app.post('/send', (req, res) => {
    const message = req.body.message;
    const username = req.body.username;
    console.log(username);

    if (message) {
        const data = `${username}: ${message}\n`;

        fs.appendFile('chat.txt', data, (err) => {
            if (err) throw err;
            console.log('Message saved to chat.txt');
        });

        res.redirect('/');
    } else {
        res.send('Message cannot be empty');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


