# Aptos Chatbot

## Bounty Target: Aptos Bounty #1

### Probem Overview:
Aptos developers often face challenges in finding accurate, relevant information about Move smart contracts, tooling, and deployment processes, requiring time-consuming searches through extensive documentation. There’s a need for an efficient, context-aware assistant that can quickly provide answers to technical questions without requiring manual navigation of resources.

### Objective:
Create a chatbot that answers Aptos developer questions related to moving smart contracts, deployment processes, and tooling in natural language with a focus on reliable, accurate, and digestible data. The chatbot should be able to extract information from Aptos repos and docs.

### Approach:
1. **Obtain Data** -  Fork/Clone the largest Aptos documentation repos (Aptos Dev Docs, Aptos Core) for their data
2. **Prepare Data** - Load documents (.md, .mdx, .pdf) and split them into text chunks with chunk overlap improving context coverage
3. **Process Data** - Convert the text chunks into vector embeddings using HuggingFace Embeddings.
4. **Store Data** - Save embeddings into ChromaDB for efficient vector retrieval.
5. **Retrieve Data** - Use similarity search in ChromaDB to find the most relevant document chunks based on user queries.
6. **Chatbot Integration** - Construct a prompt using retrieved context and query Groq's LLM to generate an answer.
7. **User Interface** - Display query and generated response on the React user interface.

### Technologies Used:
- **Frontend**:
  - **NextJS** - Allows for server-side rendering for React.
  - **React** - Frontend JavaScript library to display user interface.
  - **Typescript** - Type-safe to ensure code readability and reliability.
  
- **Backend**:
  - **Python** - Primary backend language to prepare and process data.
  - **FastAPI** - Async API endpoints for communication with the Next.js frontend.
  - **WebSockets** - Bidirectional connection for maintaining session context and faster response times.

- **Machine Learning & NLP**:
  - **Hugging Face Embeddings** - Converts text to vector embeddings.
  
- **Vector Database**:
  - **ChromaDB** - Stores and retrieves embeddings for similarity searches.

- **LLMs**:
  - **Groq Cloud API** - Free API access to LLMs for generating responses.

- **Data Processing**:
  - **File Loaders** - Load and parse files for conversion.
  - **LangChain RecursiveCharacterTextSplitter** - Creates text chunks.

### How to Run:
Please refrence [README.MD](README.md)

### Highlight Features:
- **RAG Search** - Aptos-related documentation has been chunked and vectorized into ChromaDB for similarity searches.
- **Suggested Questions** - After the chatbot responds, it also suggests follow-up questions that the users are likely to ask for clarification.
- **Chat History** - Current session queries and responses are displayed on the React frontend.
- **Maintain Context** - WebSockets are used to store current session queries and responses for further context in answering additional session questions.
- **Docs Integration** - Directly Process forked Aptos documentation through the `addAdditional.py` (append) or `createDatabase.py` (clear and overwrite).
- **Brand Customization** - Integrated Aptos company logo and color scheme.
- **Support File Types** 
    - .md
    - .mdx
    - .txt
    - .pdf
    - .csv
    - .json

