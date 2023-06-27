from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.document_loaders import PyPDFLoader
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
import tempfile
import traceback
import urllib
from werkzeug.utils import secure_filename
import stripe

app = Flask(__name__)
CORS(app)

# Initialize the 'qa' object as a global variable
qa = {}
stripe.api_key = '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'

@app.route('/api/process-pdf', methods=['POST'])
def process_pdf():
    global qa  # Declare the 'qa' object as global

    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    file = request.files['pdf']
    file_name = secure_filename(file.filename)

    print(file_name)

    temp_file = tempfile.NamedTemporaryFile(delete=False)
    temp_file.write(file.read())
    temp_file.close()

    try:
        loader = PyPDFLoader(temp_file.name)
        documents = loader.load()

        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        texts = text_splitter.split_documents(documents)
        embeddings = OpenAIEmbeddings(openai_api_key="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")
        db = Chroma.from_documents(texts, embeddings)
        retriever = db.as_retriever(search_type="similarity", search_kwargs={"k":1})
        qa[file_name] = RetrievalQA.from_chain_type(
            llm=OpenAI(openai_api_key="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"), chain_type="stuff", retriever=retriever, return_source_documents=True)
        return jsonify({"message": "Successfully Uploaded"})

    except Exception as e:
        print("Error processing PDF:", e)
        return jsonify({"error": "Error processing PDF file"}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    global qa  # Declare the 'qa' object as global
    print(qa)

    message = request.json.get('message')
    file_name = request.json.get('backendFile')
    if not message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Process the message and get a response from the backend
        result = qa[file_name]({"query": message})

        # Convert the result to a JSON serializable format
        json_result = {
            "query": result['query'],
            "answer": result['result']
        }
        return json_result
    except Exception as e:
        print("Error processing message:", e)
        print(traceback.format_exc())  # Add this line to print the traceback

        return jsonify({"error": "Error processing message"}), 500

@app.route('/api/delete-conversation', methods=['POST'])
def delete_conversation():
    global qa  # Declare the 'qa' object as global

    file_name = request.json.get('pdf_file')
    if not file_name:
        return jsonify({"error": "No file name provided"}), 400

    try:
        # Delete the corresponding key from the 'qa' object
        del qa[file_name]
        print(qa)
        return jsonify({"message": f"Successfully deleted conversation for {file_name}"})
    except KeyError:
        return jsonify({"error": f"Conversation for {file_name} not found"}), 404
    except Exception as e:
        print("Error deleting conversation:", e)
        return jsonify({"error": "Error deleting conversation"}), 500
    
@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    session = stripe.checkout.Session.create(
      payment_method_types=['card'],
      line_items=[{
        'price': 'price_1NHnCTSDnmZGzrWBjwuIGk93',  # replace with the actual price ID from Stripe Dashboard
        'quantity': 1,
      }],
      mode='subscription',
      success_url='http://localhost:5000/',
      cancel_url='http://localhost:5000/pricing',
    )

    return jsonify(id=session.id)
if __name__ == "__main__":
    app.run(debug=True)
