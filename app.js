const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());

app.use(bodyParser.json());


// Create Sequelize instance
const sequelize = new Sequelize('tuf', 'tuf', 'Nandini@123', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define a model for code snippets
const CodeSnippet = sequelize.define('CodeSnippet', {
  username: DataTypes.STRING,
  codeLanguage: DataTypes.STRING,
  stdin: DataTypes.STRING,
  sourceCode: DataTypes.TEXT
});

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Database and tables created!');
  })
  .catch((err) => {
    console.error('Error creating database and tables: ', err);
  });

// Route to handle form submission
app.post('/submit', async (req, res) => {
    try {
      const { username, codeLanguage, stdin, sourceCode } = req.body;
      const codeSnippet = await CodeSnippet.create({
        username,
        codeLanguage,
        stdin,
        sourceCode
      });
      res.json(codeSnippet);
    } catch (err) {
      console.error('Error submitting code snippet: ', err);
      res.status(500).json({ error: 'An error occurred while submitting code snippet.' });
    }
  });
  

// Route to get all submitted entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await CodeSnippet.findAll();
    res.json(entries);
  } catch (err) {
    console.error('Error getting entries: ', err);
    res.status(500).json({ error: 'An error occurred while getting entries.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
