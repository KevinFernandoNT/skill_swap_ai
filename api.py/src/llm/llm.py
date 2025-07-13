from langchain_google_genai import ChatGoogleGenerativeAI
import os

# Ensure the GOOGLE_API_KEY is set in your environment
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# You can change the model to e.g. 'gemini-2.0-flash' or 'gemini-pro' as needed
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
    google_api_key="AIzaSyAORsEEJ3TlFlM_XWA7YtgL5tPBkSks0nQ",
)

def generate_response(payload):
    """
    Accepts a JSON object with 'topic' (str) and 'sub_topics' (list of str),
    and prompts the LLM to generate 10 keywords based on these.
    """
    topic = payload.get('topic', '')
    sub_topics = payload.get('sub_topics', [])
    sub_topics_str = ', '.join(sub_topics) if sub_topics else ''
    prompt = (
        f"Given the main topic: '{topic}' and the following sub-topics: {sub_topics_str}, "
        f"generate a list of exactly 10 relevant keywords that best represent the overall subject. "
        f"Return only the keywords, separated by commas."
    )
    messages = [
        ("system", "You are a helpful assistant that generates keywords for topics."),
        ("human", prompt)
    ]
    response = llm.invoke(messages)
    return response.content 