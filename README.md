# Client Intel Agent

## Overview

Client Intel Agent is a lightweight Node.js application that researches a company using the Tavily Search API and displays a summary in a simple web interface.

The application retrieves recent news, company information, funding and product signals, and generates a concise talking point for customer or sales conversations.

## Requirements

* Node.js 18 or later
* A Tavily API key

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd client-intel-agent
```

Open `server.js` and add your Tavily API key:

```javascript
const TAVILY_KEY = "YOUR_TAVILY_API_KEY";
```

## Running the Application

Start the server:

```bash
node server.js
```

Open your browser and navigate to:

```
http://localhost:3000
```

## How It Works

1. Enter a company name.
2. The application sends two search requests to the Tavily Search API.
3. The results are processed into:

   * Company summary
   * Latest news
   * Key business signals
   * Suggested talking point
   * Source domains
4. The information is displayed in the web interface.

## Project Structure

```
.
├── server.js
└── README.md
```

## API Endpoint

```
GET /api/intel?company=<company-name>
```

Example:

```
GET /api/intel?company=Anthropic
```

## Notes

* The frontend is embedded directly inside `server.js`.
* The application uses Node.js built-in `http` and `https` modules.
* A valid Tavily API key is required for the application to function.
