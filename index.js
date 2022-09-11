const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-creator-node');
const options = require('./helpers/options');

const app = express();

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())

const homeview = (req, res) => {
  res.render('home');
}

const generatePdf = async (req, res) => {
      console.log("Creating PDF")
      const pdfDetails = req.body;
      const html = fs.readFileSync('./views/template.html', 'utf-8');
      const filename = pdfDetails.name + "_" + Math.random() + '.pdf';

      const document = {
        html: html,
        data: pdfDetails,
        path: './docs/' + filename
      }
      pdf.create(document, options)
          .then(result => {
                console.log("PDF Generated for " + pdfDetails.name);
                const filepath = './docs/' + filename;

                var options = {
                  root: path.join(__dirname)
                };
                res.sendFile(filepath, options)
          })
          .catch(error => {
                console.log(error);
          });
      
}

app.get('/', homeview);
app.post('/download', generatePdf);




app.listen(3000, () => console.log('App is listening on url http://localhost:3000'));