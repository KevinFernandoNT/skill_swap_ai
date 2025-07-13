from flask import Flask, request, jsonify
from routes.agent import agents_bp
from routes.llm import llm_bp
from dotenv import load_dotenv
from _pinecone.retreiver import initialize_global_instances

app = Flask(__name__)

app.register_blueprint(agents_bp, url_prefix='/api/v1')
app.register_blueprint(llm_bp, url_prefix='/api/v1')

def main():
    return 'Welcome to Skill Swap AI Python API!'

@app.route('/')
def index():
    return main()

def initialize_api():
    """
    Initialize API components including global instances.
    """
    try:
        # Load environment variables first
        load_dotenv()
        
        # Initialize global Pinecone instances
        print("Initializing global Pinecone instances...")
        initialize_global_instances()
        print("✓ API initialization completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during API initialization: {e}")
        raise

if __name__ == '__main__':
    # Initialize API components
    initialize_api()
    
    # Start the Flask app
    app.run(debug=True)
