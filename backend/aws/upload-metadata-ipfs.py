from moralis import evm_api
import json
import boto3
import base64
import os

MORARIS_KEY = os.environ['Moralis_Key']
s3 = boto3.resource('s3')
BUCKET_NAME = "dao-organizor"

def lambda_handler(event, context):
    print(event["body-json"])
    
    bucket = s3.Bucket(BUCKET_NAME)
    file_id = event["body-json"]["token_id"]
    event["body-json"]["attributes"][-1] = {'value': 'Unused','trait_type': 'Status'}
    r01 = upload_to_ipfs(event["body-json"], file_id)
    
    #forged NFT
    file_object = event["body-json"]["name"]
    file_id_int = int(event["body-json"]["token_id"]) + 1
    file_name = event["body-json"]["name"] + " (Used)"
    event["body-json"]["name"] = file_name
    event["body-json"]["token_id"] = str(file_id_int)
    event["body-json"]["attributes"][-1] = {'value': 'Used','trait_type': 'Status'}
    r02 = upload_to_ipfs(event["body-json"], str(file_id_int))
    
    return {
        'request': 'Success',
        'statusCode': 200,
        'body': {
            'r1': r01,
            'r2': r02
        }
    }

def upload_to_ipfs(content, file_id_str):
    body = [{
        "path": f"ticket/{file_id_str}",
        "content": base64.b64encode(bytes(json.dumps(content), 'ascii')).decode('ascii')
    }]

    result = evm_api.ipfs.upload_folder(
        api_key=MORARIS_KEY,
        body=body,
    )
    
    print(result)
    return result[0]['path']