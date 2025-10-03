# AI Research Assistant Chrome Extension

An AI-powered research assistant that helps you summarize web content and take notes directly in your browser using Google's Gemini API.

## Features

- **Smart Text Summarization**: Select any text on a webpage and get instant AI-generated summaries
- **Note-Taking**: Built-in notepad to save research notes locally in your browser
- **Side Panel Interface**: Clean, non-intrusive side panel that works alongside your browsing
- **Spring Boot Backend**: Robust REST API handling AI model interactions

## Tech Stack

**Backend:**
- Spring Boot (Java)
- Google Gemini API
- WebFlux/WebClient for HTTP requests
- Lombok for boilerplate reduction
- Jackson for JSON processing

**Frontend:**
- Chrome Extension (Manifest V3)
- HTML/CSS/JavaScript
- Chrome Storage API for local data persistence

## Prerequisites

- Java 17 or higher
- Maven
- Google Chrome browser
- Google Gemini API key ([Get it here](https://ai.google.dev))
- IntelliJ IDEA or any Java IDE

## Backend Setup

1. **Clone or download the project**

2. **Configure API Key**
   
   Create/edit `src/main/resources/application.properties`:
   ```properties
   gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=
   gemini.api.key=${GEMINI_KEY}
   ```

3. **Set Environment Variable**
   
   In IntelliJ IDEA:
   - Go to Run → Edit Configurations
   - Click on Modify Options → Environment Variables
   - Add: `GEMINI_KEY=your_actual_api_key_here`
   - Click Apply → OK

4. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`

## Chrome Extension Setup

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

2. **Load the Extension**
   - Click "Load unpacked"
   - Select the extension folder containing `manifest.json`

3. **Pin the Extension**
   - Click the puzzle icon in Chrome toolbar
   - Find "Research Assistant" and click the pin icon

## Usage

1. **Ensure the backend is running** on `localhost:8080`

2. **Open any webpage** with text content

3. **Select text** you want to summarize

4. **Click the Research Assistant icon** (R) in your Chrome toolbar

5. **Click "Summarize"** to get an AI-generated summary

6. **Take notes** in the text area and click "Save Notes" to persist them locally

## Project Structure

### Backend
```
src/
├── main/
│   ├── java/com/research/assistant/
│   │   ├── ResearchController.java      # REST endpoints
│   │   ├── ResearchService.java         # Business logic
│   │   ├── ResearchRequest.java         # Request DTO
│   │   └── GeminiResponse.java          # Response DTO
│   └── resources/
│       └── application.properties       # Configuration
```

### Extension
```
extension/
├── manifest.json           # Extension configuration
├── sidePanel.html         # UI structure
├── sidePanel.css          # Styling
├── sidePanel.js           # Frontend logic
└── background.js          # Service worker
```

## API Endpoints

### POST `/api/research/process`

**Request Body:**
```json
{
  "content": "Text to process",
  "operation": "summarize"
}
```

**Response:**
```
AI-generated summary text
```

## Customization

### Adding New Operations

1. **Update Backend** (`ResearchService.java`):
   ```java
   case "suggest":
       prompt.append("Suggest related topics based on: ");
       break;
   ```

2. **Update Frontend** (`sidePanel.html`):
   Add a new button with corresponding event listener

### Modify Summary Style

Edit the prompt in `ResearchService.java`:
```java
case "summarize":
    prompt.append("Provide a summary in 3 bullet points: ");
    break;
```

## Troubleshooting

**Extension not loading:**
- Check console for errors in `chrome://extensions/`
- Verify `manifest.json` syntax
- Ensure all file paths are correct

**API errors:**
- Confirm backend is running on port 8080
- Check GEMINI_KEY is set correctly
- Verify API key has proper permissions

**Summarization not working:**
- Select text before clicking "Summarize"
- Check browser console (right-click extension → Inspect)
- Verify CORS is enabled in backend

## Contributing

Feel free to fork this project and add features like:
- Citation generation
- Multiple AI model support
- Export notes functionality
- Custom summarization lengths

## License

This project is for educational purposes. Ensure compliance with Google Gemini API terms of service.

## Acknowledgments

- Google Gemini API for AI capabilities
- Spring Framework documentation
- Chrome Extensions documentation

---

**Note:** Keep your API key secure and never commit it to version control. Always use environment variables for sensitive data.
