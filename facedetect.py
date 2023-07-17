import cv2
import numpy as np
import sys
import urllib.request
video_url = sys.argv[1]

# Load the face detection model
net = cv2.dnn.readNetFromCaffe('deploy.prototxt', 'res10_300x300_ssd_iter_140000.caffemodel')
 

# Open the video capture object
video_capture = cv2.VideoCapture()

# Open the video URL using urllib and pass it to VideoCapture
video_capture.open(video_url)

total_faces_detected = 0
unique_faces_detected = []

frame_count = 0  # Initialize frame count

while True:
    ret, frame = video_capture.read()
    if not ret:
        break

    # Resize the frame to half of its original size
    frame = cv2.resize(frame, (int(frame.shape[1] / 2), int(frame.shape[0] / 2)))

    # Get the dimensions of the frame
    (h, w) = frame.shape[:2]

    # Create a blob from the image
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))

    # Set the input to the model
    net.setInput(blob)

    # Make detections
    detections = net.forward()

    # Loop over the detections
    for i in range(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]

        # Filter out weak detections
        if confidence > 0.7:
            # Get the bounding box coordinates
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (x, y, x2, y2) = box.astype("int")

            # Check if this is a new face
            face_detected = False
            for (fx, fy, fw, fh) in unique_faces_detected:
                if abs(fx - x) < 50 and abs(fy - y) < 50:
                    face_detected = True
                    break

            if not face_detected:
                unique_faces_detected.append((x, y, x2, y2))
                total_faces_detected += 1

    # Update the frame count
    frame_count += 1

# Release the video capture object
video_capture.release()

# Output the total number of unique faces detected
print(total_faces_detected)

# Terminate the script
sys.exit()
