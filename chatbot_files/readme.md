# FAST-NUCES RAG Chatbot: Web Integration Guide

This guide explains how to integrate the RAG (Retrieval-Augmented Generation) chatbot into a web application.

## 1. Required Files
The following files are essential for the chatbot to function:
- `rag_chat.py`: The core logic for retrieval and Gemini API interaction.
- `fast_index.faiss`: The vector database containing embedded document knowledge.
- `metadata.json`: Mapping of vector IDs to actual text content.
- `key.txt` (or hardcoded in script): Your Gemini API Key.

## 2. Dependencies
Ensure the web server environment has these installed:
```bash
pip install google-generativeai faiss-cpu sentence-transformers numpy
```

## 3. Web Integration Architecture
A common approach is to create a REST API (using **FastAPI** or **Flask**) that the frontend communicates with.

### Flow:
1. **Frontend**: Sends a user question (JSON) to the Backend.
2. **Backend**: 
   - Receives question.
   - Calls the `retrieve()` function (queries FAISS).
   - Calls the `ask_gemini()` function (sends context + question to Gemini).
   - Returns the text response.
3. **Frontend**: Displays the response.

## 4. Latency Optimization (Performance)

To ensure the chatbot responds quickly, follow these best practices:

### A. Persistent Loading (Singleton Pattern)
**CRITICAL**: Avoid loading the models on Every Request. Loading the `SentenceTransformer` and the `FAISS index` takes 2-5 seconds.
- **Solution**: Load them once when the server starts and keep them in memory.

```python
# In your FastAPI/Flask app:
# Load these ONCE at the top level, not inside the route function
encoder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
index = faiss.read_index('fast_index.faiss')
meta = json.load(open('metadata.json', encoding='utf-8'))

@app.post("/chat")
async def chat_endpoint(request: Request):
    # Use the pre-loaded 'encoder' and 'index' here
    ...
```

### B. Use Gemini Flash
We are currently using `gemini-1.5-flash` or `gemini-2.0-flash`. These models are designed for high speed and low latency compared to the "Pro" models.

### C. Streaming (Optional)
For a better user experience, consider implementing **Streaming**. This allows the user to see the response being typed out word-by-word, rather than waiting for the entire block to generate. 
- Gemini supports `response = model.generate_content(prompt, stream=True)`.

## 5. Security Note
- **API Key**: Currently the key is hardcoded. For production, move it to an environment variable (`.env` file).
- **CORS**: If your frontend and backend are on different domains, ensure CORS is configured in your web framework.
