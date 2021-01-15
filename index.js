const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
    console.log(`Server is listen on port ${PORT}`);
})