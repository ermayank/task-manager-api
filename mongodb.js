// CRUD operation : Create, Read, Update, Delete

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectId = mongodb.ObjectId;

const {MongoClient, ObjectId} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectId()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser : true,  useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to Database !')
    }

    const db = client.db(databaseName);

    db.collection('users').updateOne({
        _id: new ObjectId('60126431791e22af69bdc21a')
    }, {
        $set: {
            name: 'Pankaj'
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})