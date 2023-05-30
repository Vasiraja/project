import requests

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
text = 'I am a example sentence with some grammar errors. And i i nev nver and mistake the kit lk sl kll '

# Analyze the fluency
fluency_percentage = analyze_fluency(text)

# Print the fluency percentage
print(f"English fluency percentage: {fluency_percentage}%")
