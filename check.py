import requests
import numpy as np
import cv2

def analyze_fluency(frames):
    # Perform fluency checking on video frames
    # Add your fluency checking logic here
    total_frames = len(frames)
    fluent_frames = 0

    # Perform fluency checking on each frame
    for frame in frames:
        # Add your fluency checking code for each frame
        # You can use OpenCV or other libraries for frame analysis

        # For example, let's assume a frame is fluent if it's not empty (non-black)
        if frame.any():
            fluent_frames += 1

    # Calculate fluency percentage
    fluency_percentage = (fluent_frames / total_frames) * 100
    return fluency_percentage

# Specify the video URL
video_url = 'https://vidzupload.s3.ap-south-1.amazonaws.com/second.mp4'

# Download the video from the URL
response = requests.get(video_url)
video_data = response.content

# Save the video data to a file
with open('video.mp4', 'wb') as f:
    f.write(video_data)

# Read the video file using OpenCV
video = cv2.VideoCapture('video.mp4')

# Read frames from the video
frames = []
while True:
    success, frame = video.read()
    if not success:
        break
    frames.append(frame)

# Process the video frames and analyze fluency
fluency_percentage = analyze_fluency(frames)

# Print the fluency percentage
formatted_percentage = "{:.2f}".format(fluency_percentage)
print("Fluency Percentage:", formatted_percentage)
