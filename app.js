const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { response } = require('express');
dotenv.config();
const dbService = require('./dbservices');
const DbService = require('./dbservices');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// create

app.post('/insert', (request, response) => {
    const { name } = request.body
    const db = DbService.getDbServiceInstance();
    const result = db.insertNewName(name);
    //response.json({ success: true })
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err))
});

// read
app.get('/getall', (request, response) => {
    //console.log('testing')
    const db = DbService.getDbServiceInstance();
    const result = db.getAllData();
    //response.json({ success: true })
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err))
});
app.get('/getsingleentry/:id', (request, response) => {

        const db = DbService.getDbServiceInstance();
        const result = db.getSingleRowData(request.params.id)
        result
            .then(data => response.json({ data: data }))
            .catch(err => console.log(err))
    })
    // update 

app.patch('/update', (request, response) => {
    const { id, name } = request.body;
    console.log(id, name)
    const db = DbService.getDbServiceInstance();
    const result = db.updateNewName(id, name);
    //response.json({ success: true })
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err))
});

// delete

app.delete('/delete/:id', (request, response) => {

    const db = DbService.getDbServiceInstance();
    const result = db.deleteRow(request.params.id);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err))
});
//search 

app.get('/search/:key', (request, response) => {
    const { key } = request.params;
    const db = DbService.getDbServiceInstance();
    const result = db.getSearchedData(key);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err))

})


app.listen(process.env.PORT, () => console.log('app is running'));