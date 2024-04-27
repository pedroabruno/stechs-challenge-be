const express = require('express');
const app = express();


app.get("/test", (req, res) => {
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    })
    res.json({'hello':'test'})
});

app.listen(3001, () => console.log("Server ready on port 3001."));

module.exports = app;