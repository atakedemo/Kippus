import json
import boto3
import base64
import uuid

#SetUp AWS SDK (S3)
s3 = boto3.resource('s3')
s3_url = 'https://dao-org.4attraem.com'
bucket = s3.Bucket('dao-organizor')

def lambda_handler(event, context):
  try:
    data_body = event["body-json"]
    tmp_img = data_body['image_data']
    upload_data = tmp_img.split(',')[1]
    upload_data += '=' * (-len(upload_data) % 4)
    upload_file_name = str(uuid.uuid4()) +'.png'
    update_url = bucket.put_object(
        Key=f'assets/' + upload_file_name,
        Body=base64.urlsafe_b64decode(upload_data),
        ContentType='image/png'
    )

    return {
        "statusCode": 200,
        'headers': {
          'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin,Access-Control-Allow-Methods,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": s3_url + '/assets/'+ upload_file_name
    }
  except Exception as e:
    print("Error---------------------")
    print(e)
    print("Error---------------------")
    return {
      "statusCode": 400,
      'headers': {
          'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin,Access-Control-Allow-Methods,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
      "body": e
    }