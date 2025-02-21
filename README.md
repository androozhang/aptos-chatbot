# Aptos-Chatbot
## An Aptos-Focused Question-Answering Model

---
## Get Started
### Clone the repository:  
   ```sh
   git clone https://github.com/androozhang/aptos-chatbot
   ```
## Backend Setup

### Install Dependencies
1. Install **Python 3.10.0**  or **create** and **activate** a virtual environment of your choice (Conda is recommended)
   - [Download Python 3.10.0](https://www.python.org/downloads/release/python-3100/)
    - [Conda download](https://anaconda.org/anaconda/conda)

2. Change directories
    ```
    cd backend
    ```
3. Install dependencies:  
   ```sh
   pip install -r requirements.txt
   ```

   - If you encounter issues with `langchain`, remove version constraints in `requirements.txt` and reinstall.
   - Ensure your Python environment is **3.10.0**.

## Run the API
1. Make sure you are in the backend directory
1. Rename the `.env_template` file to `.env` file and add GROQ API key:  
   ```
   GROQ_API_KEY=
   ```

2. Start FastAPI:  
   ```
   uvicorn main:app --reload
   ```

---

## Database Setup (Additional)

### A pre-existing database with vectorized values is located at:  
   ```
   AllDocsDB/chroma
   ```

### Creating the Vector Database (Not needed unless you want to reset and make your own)
1. Ensure all **.mdx** files are in the correct directory:  
   ```python
   # Update constants in `create_database.py`
   DATA_PATH = "data/mdx"  # Set to your directory
   ```

2. Run the database creation script:  
   ```sh
   python create_database.py
   ```

   - **Note:** Running this script will **wipe and recreate** the vectorized database and takes time.

### Adding to an existing Vector Database
To add new documents to the existing vector database without recreating it from scratch, follow these steps:

### Steps:
1. **Place your new files** in a directory (e.g., `data/mdx/`).
   - Supported formats: `.txt`, `.md`, `.mdx`, `.csv`, `.json`, `.pdf`.
    ```python
   # Update constants in `add_additional.py`
   DATA_PATH = "data/mdx"  # Set to your directory
   ```
2. **Run the script to process and add documents** to the vector database:
   
   ```sh
   python add_additional.py
    ```

## Frontend Setup

### Install Dependencies
1. Install **Node.js**  
   - [Download Node.js](https://nodejs.org/en/download)

2. Set up the frontend:  
   ```sh
   cd frontend
   npm install
   npm run dev
   ```


## Backend & Frontend Communication
- The **frontend** sends a websocket connection request to the **FastAPI backend**.
- The **backend** processes websocket messages as queries using **LangChain** and a **vector database** (Chroma DB).
- Results are returned through the websocket to the **frontend** and are displayed.
