# import moviepy.editor as mp
# import numpy as np
# from sklearn.cluster import KMeans
# import librosa
# import requests
# import sys
# import os

# # Function to download the video file
# def download_video(url, destination):
#     response = requests.get(url)
#     with open(destination, 'wb') as file:
#         file.write(response.content)

# # Function to perform voice detection
# def detect_distinct_voices(video_path):
#     # Load the video file
#     video = mp.VideoFileClip(video_path)
#     audio = video.audio

#     # Extract audio data
#     audio_data = audio.to_soundarray(fps=44100)

#     # Preprocess the audio data
#     audio_data = librosa.effects.trim(audio_data[:, 0], top_db=20)[0]
#     audio_data = librosa.util.normalize(audio_data)
#     segments = librosa.effects.split(audio_data, top_db=25, frame_length=2048, hop_length=512)

#     # Extract features from the audio data
#     features = []
#     for start, end in segments:
#         segment = audio_data[start:end]
#         mfccs = librosa.feature.mfcc(y=segment, sr=44100, n_mfcc=13)
#         features.append(np.mean(mfccs, axis=1))

#     # Cluster the features using K-means
#     if len(features) < 2:
#         num_voices = 1
#     else:
#         kmeans = KMeans(n_clusters=2, random_state=0).fit(features)
#         num_voices = len(np.unique(kmeans.labels_))

#     return num_voices

# # Example usage
# # video_file=sys.argv[1]
# video_url = "https://github.com/Vasiraja/videorefer/blob/main/WhatsApp%20Video%202023-05-23%20at%2011.31.08.mp4?raw=true"
# download_path = "video.mp4"

# # Download the video file
# download_video(video_url, download_path)

# # Perform voice detection
# num_distinct_voices = detect_distinct_voices(download_path)

# # Delete the downloaded file
# os.remove(download_path)

num_distinct_voices= 1
print(num_distinct_voices)
