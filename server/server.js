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
      prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by Outer[SPACE]. How can I help you today?\nHuman: ",
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
     stop: [" Human:", " AI:"],
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))

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
