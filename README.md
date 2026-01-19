This frontend project was migrated from **TanStack Router** to **TanStack Start**.  
The continuation of the codebase is available here: [careercare-frontend-start](https://github.com/jaTorio20/careercare-frontend-start).

### Why the migration?
- **SEO improvements**: TanStack Start provides server-side rendering (SSR) and meta handling, which helps search engines index content more effectively.  
- **SSR capability**: By rendering pages on the server, the app delivers faster initial load times and better performance for users, especially important for recruiter-facing projects.  
- **Modern DX**: TanStack Start integrates loaders, file-based routing, and enhanced developer experience compared to TanStack Router.  


# CareerCare Frontend

CareerCare Frontend is a React application that provides an intuitive interface for job seekers to analyze resumes, generate cover letters, track job applications, and practice interviews with AI assistance.

## What This Application Does

CareerCare is an all-in-one career assistance platform that helps users:

- **Resume Analysis**: Upload resumes and get AI-powered feedback including ATS scores, keyword matching, and improvement suggestions
- **Cover Letter Generation**: Create personalized cover letters using AI, with a rich text editor for customization
- **Job Application Tracking**: Organize and track job applications with status updates, notes, and resume attachments
- **AI Interview Practice**: Practice interviews with real-time speech-to-text transcription and AI-generated questions and responses

## How It Works

### Architecture Overview

The frontend is built with React 19 and TypeScript, using modern React patterns:

- **TanStack Router** (`src/routes/`): File-based routing system for navigation
- **TanStack Query** (`src/api/` and `src/features/`): Data fetching, caching, and state management
- **Components** (`src/components/`): Reusable UI components organized by feature
- **Context** (`src/context/`): Global state management (authentication, theme)
- **Services** (`src/lib/`): Axios configuration, authentication helpers

### Main Features Breakdown

#### 1. Resume Analysis (`src/routes/resumes/`)
- **Upload Page**: Users upload a PDF or Word resume file and provide a job description
- **Analysis Process**: 
  - File is uploaded to the backend
  - Analysis job is created and queued
  - Frontend polls for results using TanStack Query
  - Results display includes ATS score, keyword analysis, and improvement suggestions
- **Results View**: Visual feedback with color-coded scores and actionable recommendations
- **Save Functionality**: Users can save analyzed resumes to their account

#### 2. Cover Letter Generation (`src/routes/cover-letter/`)
- **Generation Form**: Users input job details (title, company, description) and optional personal details
- **AI Generation**: 
  - Request is sent to backend with Google Gemini AI
  - Generated letter appears in a rich text editor (TipTap)
- **Editor Features** (`src/components/cover-letter/EditorMenubar.tsx`):
  - Font family, size, and styling options
  - Text alignment, line spacing, paragraph spacing
  - Zoom controls for preview
- **Export**: Letters can be exported as Word documents (.docx) or PDFs

#### 3. Job Application Tracking (`src/routes/applications/`)
- **Application Cards**: View all applications in a card-based layout
- **Create/Edit Forms**: Add new applications with company info, job details, status, location, salary range, and notes
- **File Attachments**: Upload and attach resume files (stored in Cloudinary)
- **Status Management**: Track application status (applied, interviewing, offer, rejected, etc.)
- **Search & Filter**: Find applications by company name or job title

#### 4. Interview Practice (`src/routes/interview/`)
- **Session Management**: 
  - Create interview sessions with job title, company, topic, and difficulty
  - Sidebar shows all sessions with labels
- **Chat Interface**:
  - Text-based conversation with AI interviewer
  - Audio recording support with real-time transcription
  - Audio files are recorded, converted to WAV format, and uploaded to Backblaze B2
- **Audio Player** (`src/components/Interview/WaveformAudioPlayer.tsx`):
  - Visual waveform display
  - Playback controls with time tracking
  - Shows current time, duration, and progress bar
- **AI Responses**: Google Gemini AI provides context-aware interview questions and feedback based on conversation history

#### 5. Authentication (`src/routes/auth/` and `src/context/`)
- **Login/Register**: Traditional email and password authentication
- **Google OAuth**: Social login with Google accounts
- **Token Management**: 
  - Access tokens stored in localStorage
  - Automatic token refresh via Axios interceptors (`src/lib/axios.ts`)
  - Protected routes redirect to login if unauthenticated
- **User Context**: Global user state available throughout the app

### Key Technologies

- **React 19**: UI framework with hooks and modern patterns
- **TypeScript**: Type-safe development
- **TanStack Router**: File-based routing with type safety
- **TanStack Query**: Server state management and caching
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **TipTap**: Rich text editor for cover letters
- **Axios**: HTTP client with interceptors for auth
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend API server running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

This should match your backend server URL.

3. Start the development server:
```bash
npm run dev
```

The application will start on `http://localhost:3000` (or the port specified by Vite).

### Production Build

1. Build for production:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run serve
```

The built files will be in the `dist/` directory, ready for deployment.

## Application Flow

### User Journey

1. **Landing/Home** (`src/routes/index.tsx`):
   - Welcome page with feature overview
   - Quick links to main features
   - Call-to-action buttons

2. **Authentication**:
   - New users register or login with Google
   - Session persists across page refreshes
   - Protected routes require authentication

3. **Resume Analysis**:
   - Upload resume → Provide job description → View analysis results → Save if needed

4. **Cover Letter**:
   - Generate letter → Edit in rich text editor → Save → View/Edit later → Export

5. **Job Applications**:
   - Create application card → Fill details → Attach resume → Track status updates

6. **Interview Practice**:
   - Create session → Start conversation → Send text or record audio → Receive AI feedback → Review history

### Data Flow

- **API Calls**: All API requests go through Axios instance configured in `src/lib/axios.ts`
- **State Management**: 
  - Server state: TanStack Query handles fetching, caching, and mutations
  - Client state: React hooks (useState, useRef) for local UI state
  - Global state: Context API for user authentication
- **Routing**: TanStack Router handles navigation with type-safe params and search params

## Key Components

- **Header** (`src/components/Header.tsx`): Main navigation with user menu and logout
- **ProtectedRoute** (`src/components/ProtectedRoute.tsx`): Wrapper component that checks authentication
- **AudioRecorder** (`src/components/Interview/AudioRecorder.tsx`): Records audio with pause/resume and progress tracking
- **WaveformAudioPlayer** (`src/components/Interview/WaveformAudioPlayer.tsx`): Plays audio with visual waveform and time controls
- **CoverLetterEditor** (`src/components/cover-letter/CoverLetterEditor.tsx`): Rich text editor with formatting toolbar

## Styling

The application uses TailwindCSS for styling:
- Utility classes for layout, colors, spacing
- Responsive design with mobile-first approach
- Custom color palette (indigo primary, gray neutrals)
- Consistent component styling patterns

## Error Handling

- API errors are caught by TanStack Query and displayed via toast notifications
- Form validation errors show inline messages
- Network errors are handled gracefully with retry mechanisms
- 401 errors trigger automatic token refresh

## Performance Optimizations

- Code splitting via Vite's dynamic imports
- Image optimization for uploaded files
- Query caching reduces unnecessary API calls
- Optimistic updates for better UX (interviews, applications)
- Lazy loading for route components

## Browser Support

Modern browsers with support for:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Audio recording API (for interview feature)
- LocalStorage (for token storage)
