1. Create virtual environment for python app
python3 -m venv myenv

2. Activate venv
source myenv/bin/activate // myenv\Scripts\activate

3. Install requirements
pip install -r requirements.txt // pip install Flask Flask-Cors langchain openai chromadb tiktoken  "unstructured[md]" python-dotenv gunicorn

4. Run the app
python flask-llm-server.py
