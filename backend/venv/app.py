from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.document_loaders import PyPDFLoader
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
import tempfile

app = Flask(__name__)
CORS(app)

# Initialize the 'qa' object as a global variable
qa = None

@app.route('/api/process-pdf', methods=['POST'])
def process_pdf():
    global qa  # Declare the 'qa' object as global

    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    file = request.files['pdf']

    temp_file = tempfile.NamedTemporaryFile(delete=False)
    temp_file.write(file.read())
    temp_file.close()

    try:
        loader = PyPDFLoader(temp_file.name)
        documents = loader.load()

        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        texts = text_splitter.split_documents(documents)
        # select which embeddings we want to use
        embeddings = OpenAIEmbeddings(openai_api_key="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")
        # create the vectorestore to use as the index
        db = Chroma.from_documents(texts, embeddings)
        # expose this index in a retriever interface
        retriever = db.as_retriever(search_type="similarity", search_kwargs={"k":1})
        # create a chain to answer questions 
        qa = RetrievalQA.from_chain_type(
            llm=OpenAI(openai_api_key="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"), chain_type="stuff", retriever=retriever, return_source_documents=True)
        return jsonify({"message": "Successfully Uploaded"})

    except Exception as e:
        print("Error processing PDF:", e)
        return jsonify({"error": "Error processing PDF file"}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    global qa  # Declare the 'qa' object as global

    message = request.json.get('message')
    if not message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Process the message and get a response from the backend
        result = qa({"query": message})

        # Convert the result to a JSON serializable format
        json_result = {
            "query": result['query'],
            "answer": result['result']
        }
        return json_result
    except Exception as e:
        print("Error processing message:", e)
        return jsonify({"error": "Error processing message"}), 500

if __name__ == "__main__":
    app.run(debug=True)
