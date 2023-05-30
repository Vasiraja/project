import sys
import requests
from sapling import SaplingClient
audio_url = sys.argv[1]

endpoint = "https://api.assemblyai.com/v2/transcript"
json = {
    "audio_url": audio_url,
    "disfluencies": True
}
headers = {
    "authorization": "0a9acaa0ce364b0b995785d7c09920c2"
}
response = requests.post(endpoint, json=json, headers=headers)
transcribed_id = response.json()["id"]
endpoint_transcribed = f"https://api.assemblyai.com/v2/transcript/{transcribed_id}"
while True:
    status_response = requests.get(endpoint_transcribed, headers=headers)
    status = status_response.json()["status"]
    if status == "completed":
        break

response = requests.get(endpoint_transcribed, headers=headers)
text = response.json()["text"]

def analyze_fluency(text):
    url = 'https://api.languagetool.org/v2/check'
    params = {
        'text': text,
        'language': 'en-US',
    }
    response = requests.get(url, params=params)
    data = response.json()

    # Calculate fluency percentage
    total_words = len(text.split())
    fluent_words = total_words - len(data['matches'])

    fluency_percentage = (fluent_words / total_words) * 100
    return fluency_percentage

# Set your text to analyze
 
# Analyze the fluency
fluency_percentage = analyze_fluency(text)
formatted_percentage = "{:.2f}".format(fluency_percentage)
print(format(formatted_percentage))
 


 