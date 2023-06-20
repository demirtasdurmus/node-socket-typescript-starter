import express from 'express';
const app = express();

app.use(express.static('public'));

app.get('/test', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

export { app };
