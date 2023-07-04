import sys
import requests
from sapling import SaplingClient

# audio_url = sys.argv[1]
audio_url = 'https://vidzupload.s3.ap-south-1.amazonaws.com/360.mp4'

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

# Initialize Sapling client with API key
api_key = 'EUBEPI6S8QRZ0DLIUC42YV233KDMYWUC'
client = SaplingClient(api_key=api_key)

# Get edits from Sapling API
edits = client.edits(text)

# Initialize lists to hold spelling and grammatical errors
spelling_errors = []
grammatical_errors = []

for edit in edits:
    if edit['general_error_type'] == 'Spelling':
        spelling_errors.append(edit)
    elif edit['general_error_type'] == 'Grammar':
        grammatical_errors.append(edit)

num_spelling_errors = len(spelling_errors)
num_grammatical_errors = len(grammatical_errors)

# Print the outputs
print("no. of Spell errors",num_spelling_errors)
print("no. of grammatical errors",num_grammatical_errors)
