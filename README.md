# Bluerock Showcase Project

Small API that loads Agent's information from Logtime Reports or Agent Performance Reports.

### API Methods

| Method | Description                     | Endpoint                            |
| ------ | ------------------------------- | ----------------------------------- |
| POST   | Upload Agent Performance Report | /api/reports/uploadAgentPerformance |
| POST   | Upload Logtime Report           | /api/reports/uploadLogtime          |
| GET    | Get All Agents                  | /api/agents                         |
| GET    | Get Agent by Username           | /api/agents/:username               |
| DELETE | Delete All Agents               | /api/agents                         |
| DELETE | Delete Agent by Username        | /api/agents/:username               |

## Setup

The project is programmed with Nodejs as the environment and Typescript as the programming language to add type verification. The server framework used is Expressjs.
The node version used is 23.10.0 and the npm version used is 10.9.2

To run the project first install all dependencies using the following command:

`npm install`

Once dependencies are installed, run the server with the following command:

`npm run dev`

The server runs in port 3000 by default unless specified otherwise in a .env file

`localhosthttp://localhost:8000`

## Testing

To test the API there is a postman json import file under

`postman/Bluerock Showcase.postman_collection.json`

To test the POST methods:

The `api/reports/uploadAgentPerformance` method uses an Agent Performance Report in Excel (.xlsx) format.

Likewise the `/api/reports/uploadLogtime ` method uses a Agent Log Time Report in Excel (.xlsx) format.

Samples for this two report files can be found under the `upload-test-files` folder.
