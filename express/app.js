const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require("path");
const expressHbs = require('express-handlebars');

const app = express();

// app.engine('hbs', expressHbs.engine({
//   extname: "hbs",
//   defaultLayout: "main-layout",
//   layoutsDir: "",
// }));
// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req,res,next) => {
  res.status(404).render('404', {pageTitle: 'Not Found'});
});

app.listen(3000);