import sys
import requests
from sapling import SaplingClient
audio_url = sys.argv[1]
# audio_url='https://github.com/Vasiraja/videorefer/blob/main/first.mp4?raw=true'

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
print(text)
 

 
# # Initialize Sapling client with API key
# api_key ='RP3ABL74AJ0TQ1DNMFW7SWKEPKW9VF37'
# client = SaplingClient(api_key=api_key)



# # Input text to check
 
# # Get edits from Sapling API
# edits = client.edits(text)

# # Initialize lists to hold spelling and grammatical errors
# spelling_errors = []
# grammatical_errors = []

# # Loop through each edit and add it to the appropriate list based on its error type
# for edit in edits:
#     if edit['general_error_type'] == 'Spelling':
#         spelling_errors.append(edit)
#     elif edit['general_error_type'] == 'Grammar':
#         grammatical_errors.append(edit)

# # Print out the spelling errors with correct replacements
# print("Spelling Errors:")
# for error in spelling_errors:
#     print("Sentence:", error['sentence'])
#     print("Error Type:", error['general_error_type'])
#     print("Incorrect Word:", error['sentence'][error['start']:error['end']])
#     print("Replacement:", error['replacement'])
#     print()

# # Print out the grammatical errors with correct replacements
# print("Grammatical Errors:")
# for error in grammatical_errors:
#     print("Sentence:", error['sentence'])
#     print("Error Type:", error['general_error_type'])
#     print("Incorrect Phrase:", error['sentence'][error['start']:error['end']])
#     print("Replacement:", error['replacement'])
 

# #  Send transcription text to Node.js
# # url = "http://localhost:3000/transcription"


# # response1 = requests.post(url, json={"text": text})

# # if response1.status_code == 200:
# #     print("Transcription text successfully sent to Node.js.")
# # else:
# #     print("Error: Could not send transcription text to Node.js.")




# # Print the response data
# # print(response_json)
# # print(response)
