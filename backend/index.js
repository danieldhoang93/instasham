//dependencies
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
let inspect = require('util').inspect;
let Busboy = require('busboy');
let path = require('path');
let os = require('os');
let fs = require('fs');
let UUID = require('uuid-v4');

//config - express
const app = express()

//firebase config
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "instasham-77817.appspot.com"
});

const db = admin.firestore();
var bucket = admin.storage().bucket();

const port = 3000

app.use(cors())

//POST endpoint
app.get('/posts', (request, response) => {
    //allows anyone to access our endpoint
    response.set('Access-Control-Allow-Origin', '*')
    let posts = [];
    //get data from collection, sorted by earliest date
    db.collection('posts').orderBy('date' ,'desc').get().then(snapshot =>{
        snapshot.forEach((doc) => {
        posts.push(doc.data());
        });
        response.send(posts)
    })
})


//CREATE endpoint
app.post('/create', (request, response) => {
    //allows anyone to access our endpoint
    response.set('Access-Control-Allow-Origin', '*')
    
    let uuid = UUID();
    var busboy = new Busboy({ headers: request.headers });
    let fields = {};
    let fileData = {};

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        
        let filepath = path.join(os.tmpdir(),filename)
        file.pipe(fs.createWriteStream(filepath))
        fileData = {filepath, mimetype}
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        fields[fieldname] = val;
    });
    busboy.on('finish', function() {
        bucket.upload(
            fileData.filepath,
            {
                uploadType: 'media',
                metadata: {
                    metadata: {
                        contentType: fileData.mimetype,
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            },
            (error, uploadedFile) => {
                if (!error) {
                    createDocument(uploadedFile)
                }
            }
        )

        function createDocument(uploadedFile) {
            db.collection('posts').doc(fields.id).set({
                id: fields.id,
                caption: fields.caption,
                location: fields.location,
                date: parseInt(fields.date),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
            }).then(() => {
                response.send('Post added');
            })
        }
        
    });
    request.pipe(busboy);
})

app.listen(process.env.PORT || 3000)