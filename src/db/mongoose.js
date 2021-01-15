const mongoose = require('mongoose');

console.log('Wait for a seconds, connecting to the database...');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
} , (err) => {
    if(err) {
        console.log(err);
    }
    else {
        console.log('Database Connected!');
    }
})