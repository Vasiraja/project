import speech_recognition as sr
from pydub import AudioSegment
import requests
import numpy as np
import librosa
import matplotlib.pyplot as plt

video_url = "https://vidzupload.s3.ap-south-1.amazonaws.com/beem.mp4"
audio_path = "output_audio.wav"

# Download the video file
response = requests.get(video_url)
with open("video.mp4", "wb") as f:
    f.write(response.content)

# Convert video to audio using pydub
video = AudioSegment.from_file("video.mp4")
video.export(audio_path, format="wav")

# Load audio using librosa
audio, sr = librosa.load(audio_path)

# Apply VAD (Voice Activity Detection) using librosa
vad = librosa.effects.split(audio, top_db=30)
vad_audio = np.concatenate([audio[start:end] for start, end in vad])

# Perform speaker diarization using librosa
speaker_labels = librosa.segment.recurrence_matrix(vad_audio)
num_speakers = len(np.unique(speaker_labels))

print("Number of distinct voices:", num_speakers)
