# AI Document Assistant

AI-powered SaaS application that allows users to upload documents, ask questions, and receive intelligent answers based on document content.

---

## Features

### Authentication
- User Registration
- User Login

### Document Management
- Upload text/html documents
- Store document content
- Split documents into searchable chunks

### Smart Search
- Keyword search
- Vector similarity search using embeddings
- Cosine similarity ranking

### AI Answers
- Retrieves relevant chunks
- Sends context to AI model
- Returns concise answers based on uploaded documents only

### Chat Memory
- Persistent chat sessions
- Stores user questions and AI responses
- Chat history per user

---

## Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL

### AI Integration
- OpenRouter / OpenAI compatible APIs

### Planned Frontend
- Next.js
- Tailwind CSS

---

## Database Models

### User
- Id
- FullName
- Email
- PasswordHash
- CreatedAt

### Document
- Id
- UserId
- FileName
- FilePath
- Content
- Status
- CreatedAt

### DocumentChunk
- Id
- DocumentId
- Content
- Embedding
- CreatedAt

### Chat
- Id
- UserId
- CreatedAt

### Message
- Id
- ChatId
- Role
- Content
- CreatedAt

---

## Current Progress

Backend MVP nearly complete:

- Authentication
- Document Upload
- Search
- AI Answers
- Chat Memory

Frontend integration starting next.

---

## Future Improvements

- PDF / DOCX support
- Multiple chat sessions
- Better UI/UX
- Team accounts
- Billing / subscriptions
- Production deployment
- Advanced RAG pipeline

---

## How to Run

### Backend

```bash
dotnet restore
dotnet run
