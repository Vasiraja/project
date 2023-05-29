import moviepy.editor as mp
import requests
import os
from pyAudioAnalysis import audioSegmentation as aS

def download_file(url, save_path):
    response = requests.get(url, stream=True)
    with open(save_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)

def extract_audio(video_path):
    video = mp.VideoFileClip(video_path)
    audio = video.audio
    audio_path = "temp_audio.wav"
    audio.write_audiofile(audio_path)
    return audio_path

def detect_unique_voices(audio_path):
    # Run speaker diarization using pyAudioAnalysis
    segments = aS.speaker_diarization(audio_path, n_speakers=0)

    # Count unique voices
    unique_voices = len(set(segments))

    return unique_voices

# Example usage
video_url = "https://github.com/Vasiraja/videorefer/blob/main/long.mp4?raw=true"
video_file = "temp_video.mp4"
audio_file = "temp_audio.wav"

# Download video file
download_file(video_url, video_file)

# Extract audio from video file
audio_file = extract_audio(video_file)

# Detect unique voices
num_unique_voices = detect_unique_voices(audio_file)
print("Number of unique voices:", num_unique_voices)

# Clean up temporary files
os.remove(video_file)
os.remove(audio_file)
