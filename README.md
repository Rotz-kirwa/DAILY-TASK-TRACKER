# Personal Workspace

A web application for managing personal files, links, photos, project ideas, and reminders in one place.

## Features

- **File Manager**: Upload and store files from your computer
- **Link Manager**: Save and organize important links
- **Photo Gallery**: Upload and view your photos
- **Project Ideas**: Write and save your project concepts
- **Reminders**: Set reminders with sound notifications

## Technologies Used

- React
- React Router
- HTML5 Web Storage API (localStorage)
- HTML5 Audio API
- Browser Notifications API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
cd empire
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### File Manager
- Upload files from your computer
- View and download saved files
- Delete files when no longer needed

### Link Manager
- Save links with custom titles
- Organize links for easy access
- Delete links when no longer needed

### Photo Gallery
- Upload photos from your computer
- View photos in a gallery format
- Delete photos when no longer needed

### Project Ideas
- Write down project concepts with titles and descriptions
- Edit your ideas as they evolve
- Keep track of when ideas were created and last edited

### Reminders
- Set reminders with dates and times
- Receive sound notifications when reminders are due
- Mark reminders as completed
- Enable browser notifications for alerts even when the tab is not active

## Data Storage

All data is stored in your browser's localStorage. This means:
- Your data stays on your device
- No server or database is required
- Data persists between sessions
- There is a storage limit (typically 5-10MB)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Sound notification from [Mixkit](https://mixkit.co)
- Icons and design inspiration from various sources