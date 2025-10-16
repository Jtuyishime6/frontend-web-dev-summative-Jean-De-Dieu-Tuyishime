# Campus Event Planner is my chosen theme

A responsive Built with vanilla JavaScript, HTML, and CSS.

**Live Demo:** [Your Youtube URL Here]
**Github Pages** :[link]

**Author:** Jean de Dieu Tuyishime  
**Role:** Software Engineering Student at ALU  
**Contact:** j.tuyishime6@alustudent.com | [GitHub Profile](https://github.com/Jtuyishime6)

---

## Features

### Core Functionalities

- **Event Management**: Create, read, update, and delete campus events
- **Advanced Search**: Regex-powered search with real-time highlighting
- **Smart Filtering**: Filter events by category/tag
- **Multiple Sorting**: Sort by date, title, or duration
- **Data Persistence**: LocalStorage with JSON import/export
- **Theme Toggle**: Light and dark mode with preference persistence
- **Statistics Dashboard**: Total events, completion rate, hours tracked, trends

### Validation

- 4+ comprehensive regex validation rules
- Advanced pattern: Duplicate word detection using back-reference `\b(\w+)\s+\1\b`
- Real-time error feedback with accessible messaging
- Input sanitization to prevent XSS

---

## Technology Stack

- **HTML5**: Semantic markup with ARIA landmarks
- **CSS3**: Flexbox, Grid, CSS Variables, Media Queries
- **Vanilla JavaScript**: Modules, Classes, Arrow Functions
- **LocalStorage**

---

## File Structure

```
campus-event-planner/
├── index.html              # Main application page
├── seed.json               # Sample data (15+ events)
├── README.md              
├── styles/
│   ├── main.css           # Core styles and theme variables
│   └── responsive.css     # Mobile responsive styles
├── scripts/
│   ├── app.js             
│   ├── state.js           
│   ├── storage.js         
│   ├── validators.js                       
│   ├── search.js         
│   └── ui.js              
└── assets/
    └── placeholder for profile img
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/campus-event-planner.git
cd campus-event-planner
```

### 2. Local Development

Simply open `index.html` in a modern web browser. No build process or server required.


### 3. Load Sample Data

1. Open the application
2. Click "Import JSON"
3. Select the `seed.json` file
4. 15 sample events will be loaded

---

## Regex Catalog

### 1. Title Validation

**Pattern:** `/^\S(?:.*\S)?$/`  
**Purpose:** Prevents leading/trailing spaces and ensures non-empty content  
**Examples:**

-  Pass: `"Frontend Workshop"`, `"Event 2025"`
-  Fail: `" Leading space"`, `"Trailing space "`, `"  "`

### 2. Date Validation

**Pattern:** `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`  
**Purpose:** Enforces YYYY-MM-DD format with valid month/day ranges  
**Examples:**

- : `"2025-10-20"`, `"2025-12-31"`

- Fail: `"20/10/2025"`, `"2025-13-01"`, `"2025-02-30"`

### 3. Duration Validation

**Pattern:** `/^(0|[1-9]\d*)(\.\d{1,2})?$/`  
**Purpose:** Validates positive numbers with up to 2 decimal places  
**Examples:**

- Pass: `"2"`, `"2.5"`, `"10.25"`, `"0"`

- Fail: `"2.555"`, `"-5"`, `"abc"`, `"2.5.5"`

### 4. Tag/Category Validation

**Pattern:** `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`  
**Purpose:** Allows letters, spaces, and hyphens for category names  
**Examples:**

- Pass: `"Academic"`, `"Professional Development"`, `"Co-Curricular"`

- Fail: `"Academic2024"`, `"Social!"`, `"123"`

### 5. Advanced: Duplicate Word Detection (Back-reference)

**Pattern:** `/\b(\w+)\s+\1\b/i`  
**Purpose:** Detects consecutive duplicate words in descriptions  
**Examples:**

- Pass: `"This is a valid description"`

- Fail: `"This is is a duplicate"`, `"The the event starts"`

### 6. Search Pattern Examples

Users can search with regex patterns:

- `\d{4}` - Find events with years (e.g., "2025")
- `^Frontend` - Events starting with "Frontend"
- `Workshop|Session` - Events containing either word
- `@tag:Academic` - Custom tag filter (if implemented)

---

## Keyboard Navigation

### Global Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between interactive elements |
| `Shift + Tab` | Navigate backwards |
| `Enter` | Activate buttons and links |
| `Escape` | Close modal dialog |
| `Space` | Toggle checkboxes and buttons |

### Event Cards

| Key | Action |
|-----|--------|
| `Tab` | Focus on complete/edit/delete buttons |
| `Enter/Space` | Activate focused button |

### Search & Filters

| Key | Action |
|-----|--------|
| `Tab` | Navigate search input and filter dropdowns |
| `Arrow Keys` | Navigate dropdown options |
| `Enter` | Select dropdown option |

---

## Accessibility Features

### ARIA Implementation

- **Landmarks**: `<header>`, `<main>`, `<section>`, `<nav>`
- **Live Regions**: `role="status"` for notifications, `aria-live="polite"` for updates
- **Dialog**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Form Labels**: All inputs have associated `<label>` elements with `for` attributes
- **Button Labels**: `aria-label` for icon-only buttons

### Visual Accessibility

- **Contrast Ratio**: Minimum 4.5:1 for normal text (WCAG AA)
- **Focus Indicators**: Visible focus outline (3px blue glow) on all interactive elements
- **Skip Link**: "Skip to main content" for keyboard users
- **Color Independence**: Information not conveyed by color alone
- **Text Sizing**: Relative units (rem/em) that respect user preferences

### Screen Reader Support

- Semantic HTML structure
- Descriptive button labels
- Status announcements for dynamic content
- Form validation errors announced
- Hidden content properly marked with `.visually-hidden`

### Keyboard-Only Testing

 All features fully accessible without mouse  
 Logical tab order  
 No keyboard traps  
 Modal focus management

---

## Usage Guide

### Creating an Event

1. Click "New Event" button
2. Fill in required fields:
   - **Title**: Event name (no leading/trailing spaces)
   - **Date**: YYYY-MM-DD format
   - **Duration**: Hours (e.g., 2.5)
   - **Tag**: Category (letters, spaces, hyphens only)
   - **Description**: Optional details
3. Click "Create Event"

### Editing an Event

1. Click the edit icon (pencil) on any event card
2. Modify fields in the modal
3. Click "Update Event"

### Deleting an Event

1. Click the delete icon on any event card
2. Confirm deletion in the browser prompt

### Marking Complete

1. Click the circle icon on any event card
2. Event will show as completed (strikethrough, faded)
3. Click again to mark incomplete

### Searching Events

- Type in the search box for text search
- Use regex patterns for advanced searches:
  - `Workshop` - Find all workshops
  - `\d{4}` - Find events with years
  - `^A` - Events starting with "A"

### Filtering & Sorting

- **Filter by Category**: Dropdown shows all unique tags
- **Sort Options**: Date (chronological), Title (A-Z), Duration (shortest first)

### Import/Export Data

- **Export**: Downloads JSON file with timestamp
- **Import**: Validates structure before loading
- **Format**: Must be valid JSON array with required fields

---

## Data Model

### Event Object Structure

```javascript
{
  "id": "evt_<timestamp>_<random>",   
  "title": "Event Title",                 
  "date": "YYYY-MM-DD",                   
  "duration": "2.5",                      
  "tag": "Category Name",                 
  "description": "Optional details",      
  "createdAt": "ISO 8601 timestamp",     
  "updatedAt": "ISO 8601 timestamp",     
  "completed": false                      
}
```

### LocalStorage Keys

- `campusEvents` - Array of event objects
- `campusTheme` - Theme preference ("light" or "dark")

---


## How To Run Tests

### Running Tests

1. Open `index.html` in your browser.
2. Open the application
3. Click "Import JSON"
4. Select the `seed.json` file
5. 15 sample events will be loaded
6. Tests run automatically on page load
7. View results for:
   - Validation regex patterns
   - Advanced regex (duplicate detection)
   - Search and filter functions
   - Data structure validation

### Manual Testing Checklist

- [ ] Create event with valid data
- [ ] Attempt invalid date format
- [ ] Attempt title with leading space
- [ ] Test regex search (e.g., `\d{4}`)
- [ ] Export and import JSON
- [ ] Toggle dark/light theme
- [ ] Keyboard-only navigation
- [ ] Mobile responsive (360px, 768px)
- [ ] Complete/uncomplete events
- [ ] Edit and delete events

---

## Code Attribution

This project uses three utility functions adapted from the course starter snippets:

1. **Safe Regex Compiler** - Error-safe regex pattern compilation
2. **Highlight Matches** - Search result highlighting with `<mark>` tags  
3. **LocalStorage Persistence** - JSON data serialization helpers

All other code is original written by me.

## Project Purpose

I built this campus event planner to help myself and all ALU students manage their academic sessions, professional development events, social activities, and campus life engagements, exchange programs, and community events.

### ALU Events Managed

- Academic workshops (Frontend Dev, Responsible Enterprise)
- Professional Development sessions
- Guest speaker events
- Exchange programs (Orlando University partnership)
- Social activities and entertainment
- External events at Norrsken, ALX, Digital Centre Rwanda
- Health summits at Kigali Convention Centre
- Fireside chats with alumni
- Campus life awareness sessions

---

## License

This project is created for educational purposes as part of the ALU Software Engineering curriculum.

---

## Acknowledgments

- **African Leadership University** - Educational institution
- **Bizzabo** - Design inspiration
- **RSSB** - Supporting professional development
- **ALU Community** - Beta testing and feedback

---

## Contact 

**Jean de Dieu Tuyishime**  

 Email: [j.tuyishime6@alustudent.com](mailto:j.tuyishime6@alustudent.com)  
 GitHub: [github.com/Jtuyishime6](https://github.com/Jtuyishime6)  
 Location: Kigali, Rwanda.