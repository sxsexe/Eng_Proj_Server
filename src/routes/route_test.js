import { TTSWSServer } from '../service/tts-ws-node.js'
import { Service } from '../service/service.js'
import { Errors } from '../service/Errors.js'
import { MyResponse } from '../service/Respons.js'
import { validationResult } from 'express-validator'


export function test(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var resObj = { "test": "OK" }
    res.end(JSON.stringify(resObj));
    return;
}

export function TestTTS(req, res) {
    TTSWSServer.init();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify("{}"));
    return;
}