import json
import boto3
import base64
import datetime
import requests
import os
from bs4 import BeautifulSoup
from urllib.parse import urljoin


def lambda_handler(event, context):
    print(event["body-json"])
    
    if "id" in event["body-json"].keys():
        job_runId = event["body-json"]["id"]
    else:
        job_runId = 0
    
    #ここに外部APIを実行する処理を記述
    result = 1
    
    dic = {
        "data": {
            "jobRunID":job_runId,
            "result": result,
            "timestamp":1683950299
        }
    }
    
    return {
        "statusCode": 200,
        "body": json.dumps(dic)
    }

