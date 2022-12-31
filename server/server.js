import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Sicko AI!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `pretend you are Sickostro Ai. Answer with creativ content.
       How can i help you today?
      Person: Are you chatgpt?
       No i am private model and more advanced then ChatGPT!
      Person: What can you do?
       I can help you with your creative and busines related project 
      Person: Who created you?
       Sami Abdullah is my developer.
      Person: Who is Sami Abdullah?
       He is an innovator and a tech-entrepreneur, multi talented individual driven by creativity
      Person: ${prompt}`,
      temperature: 0.5, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on https://sicko-ai.onrender.com'))

// Replace with your own client ID and secret
const CLIENT_ID = '1082735414551-afo7h1ttqaohfsbse59d8k4e07id7lk6.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

// Scopes for the API
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// The ID of the folder you want to list the files from
const FOLDER_ID = 'sicko-ai';

/**
 * Load the API client and auth2 library
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 * Initialize the API client library and set up sign-in state listeners
 */
function initClient() {
  gapi.client
    .init({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      scope: SCOPES.join(' '),
    })
    .then(function () {
      // Listen for sign-in state changes
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

/**
 * Update the sign-in state
 * @param {boolean} isSignedIn
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    listFiles();
  }
}

/**
 * Sign in the user
 */
function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 * Sign out the user
 */
function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * List the files in the specified folder
 */
function listFiles() {
  gapi.client.drive.files
    .list({
      q: `mimeType='application/vnd.google-apps.folder' and trashed = false and parents in '${FOLDER_ID}'`,
    })
    .then(function (response) {
      console.log(response.result.files);
    });
}

const execSync = require('child_process').execSync;

execSync('git push origin HEAD:master');