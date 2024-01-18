
import moment from 'moment';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Service } from './service.js';

export class JobOneSentence {

    static async addNewSentece() {

        axios.get('https://dict.eudic.net/home/dailysentence')
            .then(res => {
                // console.log('data: ', res);
                if (res.status == 200) {
                    const htmlData = res.data;
                    const $ = cheerio.load(htmlData);

                    var ch = "";
                    var en = "";
                    var from = "";

                    try {
                        const tag_ps = $("p.sect-trans")
                        ch = tag_ps.text();
                        en = tag_ps.prev().text();
                        const tag_froms = $("span.detail_header")
                        from = tag_froms[0].children[0].data;

                    } catch (error) {
                        console.error("addNewSentece error ", error);
                    }
                    var day = moment().format('YYYY-MM-DD');
                    Service.addOneSentence({ "en": en, "ch": ch, "day": day, "from": from });

                } else {
                    console.log('JobOneSentence.addNewSentece: statusCode=', res.status);
                }
            })
            .catch(err => {
                console.log('Error: ', err.message);
            });

    }

}