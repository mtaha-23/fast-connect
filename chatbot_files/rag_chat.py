# rag_chat.py
import json
import faiss
import os
import numpy as np
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError(
        "Missing GEMINI_API_KEY env var. Set it before running (e.g. GEMINI_API_KEY=...)." 
    )
genai.configure(api_key=GEMINI_API_KEY)

# load resources
meta = json.load(open('metadata.json', encoding='utf-8'))
index = faiss.read_index('fast_index.faiss')
encoder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def retrieve(query, k=5):
    qemb = encoder.encode(query, convert_to_numpy=True).astype('float32')
    D, I = index.search(qemb[np.newaxis, :], k)
    return [meta[i]['content'] for i in I[0]]

def ask_gemini(question, contexts):
    # Setup the model - using gemini-flash-latest for potentially better availability
    try:
        model = genai.GenerativeModel('models/gemini-flash-latest')
        
        # Construct the prompt
        prompt = "You are a helpful and concise assistant for FAST-NUCES info.\n"
        prompt += "Answer the question directly using ONLY the following document excerpts.\n"
        prompt += "Do not mention that information is missing for other campuses or sections unless specifically asked.\n"
        prompt += "Avoid phrases like 'Based on the provided documents' or 'According to the context'.\n"
        prompt += "If the answer is not found in the excerpts, say: 'I'm sorry, I don't have information on that.'\n\n"
        
        for i, ctx in enumerate(contexts, 1):
            prompt += f"[Context {i}]: {ctx}\n\n"
        
        prompt += f"Question: {question}\nAnswer:"

        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        if "429" in str(e) or "quota" in str(e).lower():
            return "Error: Gemini API quota exceeded. Please try again after a minute or check your API key's usage limits."
        return f"Error calling Gemini API: {str(e)}"

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('question', help="The question to ask the chatbot")
    parser.add_argument('--topk', type=int, default=5, help="Number of context documents to retrieve")
    args = parser.parse_args()

    # Step 1: Retrieve context
    ctxs = retrieve(args.question, k=args.topk)
    
    # Step 2: Generate response
    response = ask_gemini(args.question, ctxs)
    
    print("\n--- Chatbot Response ---")
    print(response)
    print("------------------------\n")