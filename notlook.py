import cv2
import math
import sys
import dlib

# Load the face detector and landmark predictor
face_detector = dlib.get_frontal_face_detector()
landmark_predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks_GTX.dat")
video_file = sys.argv[1]

# Open the video capture object
# video_file = 'https://github.com/Vasiraja/videorefer/blob/main/click1.mp4?raw=true'
video_capture = cv2.VideoCapture(video_file)

# Initialize the eye positions for the first frame
initial_left_eye = [(263, 344), (269, 325), (283, 315), (297, 313), (313, 320), (321, 332)]
initial_right_eye = [(387, 330), (401, 319), (418, 314), (435, 316), (450, 326), (455, 339)]

# Set the threshold for eye movement
movement_threshold = 50
not_looking_camera_count = 0

# Get the total number of frames in the video
total_frames = int(video_capture.get(cv2.CAP_PROP_FRAME_COUNT))

while True:
    # Read the next frame
    ret, frame = video_capture.read()
    if not ret:
        break

    # Convert the frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the grayscale frame
    faces = face_detector(gray)

    # Process each face in the frame
    for face in faces:
        # Detect the landmarks for the face
        landmarks = landmark_predictor(gray, face)

        # Get the positions of the left and right eyes
        left_eye_new = [(landmarks.part(36).x, landmarks.part(36).y),
                         (landmarks.part(37).x, landmarks.part(37).y),
                         (landmarks.part(38).x, landmarks.part(38).y),
                         (landmarks.part(39).x, landmarks.part(39).y),
                         (landmarks.part(40).x, landmarks.part(40).y),
                         (landmarks.part(41).x, landmarks.part(41).y)]
        right_eye_new = [(landmarks.part(42).x, landmarks.part(42).y),
                         (landmarks.part(43).x, landmarks.part(43).y),
                         (landmarks.part(44).x, landmarks.part(44).y),
                         (landmarks.part(45).x, landmarks.part(45).y),
                         (landmarks.part(46).x, landmarks.part(46).y),
                         (landmarks.part(47).x, landmarks.part(47).y)]

        # Calculate the movement of the left eye
        left_eye_movement = sum(math.sqrt((left_eye_new[j][0] - initial_left_eye[j][0]) ** 2 +
                                           (left_eye_new[j][1] - initial_left_eye[j][1]) ** 2)
                                for j in range(6))

        # Calculate the movement of the right eye
        right_eye_movement = sum(math.sqrt((right_eye_new[j][0] - initial_right_eye[j][0]) ** 2 +
                                            (right_eye_new[j][1] - initial_right_eye[j][1]) ** 2)
                                 for j in range(6))

        # Check if the person is looking at the camera
        if left_eye_movement < movement_threshold and right_eye_movement < movement_threshold:
            count = 0
        else:
            not_looking_camera_count += 1

        # Update the positions of the eyes for the next frame
        initial_left_eye = left_eye_new
        initial_right_eye = right_eye_new

# Release the video capture object and close any open windows
video_capture.release()
cv2.destroyAllWindows()
if(not_looking_camera_count==0):
    not_looking_camera_count=1
print(not_looking_camera_count)
