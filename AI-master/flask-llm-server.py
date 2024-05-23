from flask import Flask, jsonify, request  # Flask for sending/receiving HTTP requests from client (React)
from flask_cors import CORS  # Allow external requests
import os  # Interact with the operating system
from dotenv import load_dotenv  # Load environment variables from .env file
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import DirectoryLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.indexes import VectorstoreIndexCreator
from langchain.vectorstores import Chroma  # Database
from langchain.text_splitter import RecursiveCharacterTextSplitter  # Split text -- later
from langchain.memory import ConversationBufferMemory  # Temporary storage
from langchain.prompts import PromptTemplate  # Explanation -- later

app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Set the OpenAI API key from environment
os.environ["OPENAI_API_KEY"] = openai_api_key

# Load documents and create indexes
loader_bsf = DirectoryLoader('./', glob="./documents/*.md")
docs = loader_bsf.load()
search_index = VectorstoreIndexCreator().from_loaders([loader_bsf])  # VectorstoreIndexCreator -- later
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)  # Change chunk_size=500?
all_splits = text_splitter.split_documents(docs)
vectorstore = Chroma.from_documents(documents=all_splits, embedding=OpenAIEmbeddings(model="text-embedding-3-small", chunk_size=200))

# Set up prompts
prompt_template = """
If you know the answer, provide it directly from the context, and then include in your answer two alternative questions as a suggestion from the context.

If the answer is not available in the context, just respond with:
"I'm sorry, I'm not able to provide an answer to your question right now. Would you like to speak with one of our customer service agents for further assistance? You can also reach us directly by calling our support line at 8001242121. How would you like to proceed?
عذرًا، لا أستطيع تقديم إجابة لسؤالك في الوقت الحالي. هل تود التحدث مع أحد وكلاء خدمة العملاء للحصول على مزيد من المساعدة؟ يمكنك أيضًا الاتصال بنا مباشرة عن طريق خط الدعم على 8001242121. كيف تود المتابعة؟"

Context: {context}
Question: {question}
"""

QA_PROMPT = PromptTemplate.from_template(template=prompt_template)

# Set up memory and models
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
llm = ChatOpenAI(model_name="gpt-4", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm,
    retriever=vectorstore.as_retriever(),
    chain_type_kwargs={"prompt": QA_PROMPT}
)

@app.route('/general_query', methods=['POST'])
def general_query():
    try:
        submission = request.get_json()
        print("Received submission:", submission)  # Check what is being received

        # Properly aligned with the rest of the code inside the 'try' block
        response = qa_chain.invoke({
            "context": submission.get("context", ""),  # Ensure context is extracted correctly
            "query": submission["prompt"]  # Ensure query is extracted correctly
        })

        return jsonify(response), 200
    except Exception as e:
        print("Error:", str(e))  # This will print the error to the Flask console
        return jsonify({'message': "Error", 'output': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Added debug=True for better debugging during development
