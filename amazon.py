import requests
import boto3

def upload_video_to_s3(bucket_name, file_path, object_name):
    s3_client = boto3.client('s3')
    s3_client.upload_file(file_path, bucket_name, object_name)

bucket_name = 'vidzupload'
file_url = 'https://vidzupload.s3.ap-south-1.amazonaws.com/second.mp4'
object_name = 'second.mp4'
local_file_path = 'C:/video.mp4'

# Download the video file
response = requests.get(file_url)
with open(local_file_path, 'wb') as file:
    file.write(response.content)

# Upload the video file to S3
upload_video_to_s3(bucket_name, local_file_path, object_name)
