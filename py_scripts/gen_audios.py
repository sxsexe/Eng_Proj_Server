
#https://api.ttson.cn:50602/flashsummary/tts
#TTS服务


import logging
import os
import json
import time
import lxml
import random
from bs4 import BeautifulSoup
import requests

from datetime import datetime

def gen_audio_by_txt(txt, dir, filename):

    audio_file = dir + filename
    if os.path.exists(audio_file):
        print(audio_file + " exists, so pass")
        pass
    else:
        payload = {
            "voice_id": 33,
            "format": "mp3",
            "to_lang": "auto"}
        url = "https://api.ttson.cn:50602/flashsummary/ttsstream?token=0D01CF9DB17E412933697D29FFD278BE"
        payload['text'] = txt
        print("---> processing " + filename)

        try:
            resp = requests.post(url, json = payload)
            if(resp.status_code == 200) :
                open(audio_file, 'wb').write(resp.content)
                print("---> " + audio_file + " Write Success")
            else:
                print("respObj not OK, status_code=" + resp.status_code)
        except Exception as e:
            print(filename + " error : ", e)




if __name__ == '__main__':
    
    with open('E:/NodeJSWorld/my_eng_program_server/py_scripts/json_OneStoryADay_January.json') as f:
        content = f.read()
        f.close()

        txt_objs = json.loads(content)
        for obj in txt_objs:
            dir = "E:/NodeJSWorld/voice/"
            txt = obj['content']
            title = obj['title'] + ".mp3"
            # print(title)
            # print(txt)
            gen_audio_by_txt(txt, dir, title)    




