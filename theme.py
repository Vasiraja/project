import sys
import requests
import base64

with open('C:/Workstation/first.mp4', 'rb') as file:
    audio_data = file.read()

# Encode the audio data as base64
audio_base64 = base64.b64encode(audio_data).decode('utf-8')

endpoint = "https://api.assemblyai.com/v2/transcript"
json = {
    "audio": audio_base64,
    "disfluencies": True
}
headers = {
    "authorization": "0a9acaa0ce364b0b995785d7c09920c2"
}
response = requests.post(endpoint, json=json, headers=headers)
response_json = response.json()
print(response_json)  # Print the response JSON for debugging

if "id" not in response_json:
    print("Transcript ID not found in the response.")
    sys.exit(1)

transcribed_id = response_json["id"]
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
print(formatted_percentage)
