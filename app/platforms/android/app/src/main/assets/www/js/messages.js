/*
    เครื่องฉิ่ง / Kreuung Ching
  This file is part of the Automatic Ching program for practicing
  Thai music.
  
  Copyright (C) 2019 David Beswick <dlbeswick@gmail.com>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
System.register([], function (exports_1, context_1) {
    "use strict";
    var MessagesEnglish, MessagesThai;
    var __moduleName = context_1 && context_1.id;
    function msgJoin(vals) {
        if (typeof vals[0] == "string")
            return vals.join(" / ");
        else
            return (...a) => vals.map(f => f(...a)).join(" / ");
    }
    function makeMultilingual(languages) {
        let result = {};
        for (let p of Object.keys(languages[0])) {
            result[p] = msgJoin(languages.map(l => l[p]));
        }
        return result;
    }
    exports_1("makeMultilingual", makeMultilingual);
    return {
        setters: [],
        execute: function () {/*
                เครื่องฉิ่ง / Kreuung Ching
              This file is part of the Automatic Ching program for practicing
              Thai music.
              
              Copyright (C) 2019 David Beswick <dlbeswick@gmail.com>
            
              This program is free software: you can redistribute it and/or modify
              it under the terms of the GNU Affero General Public License as
              published by the Free Software Foundation, either version 3 of the
              License, or (at your option) any later version.
            
              This program is distributed in the hope that it will be useful,
              but WITHOUT ANY WARRANTY; without even the implied warranty of
              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
              GNU Affero General Public License for more details.
            
              You should have received a copy of the GNU Affero General Public License
              along with this program.  If not, see <https://www.gnu.org/licenses/>.
            */
            MessagesEnglish = class MessagesEnglish {
                constructor() {
                    this.name = "English";
                }
                errorAudioContextAndroid(e) {
                    return "There was a problem creating the AudioContext object. Please try updating Chrome or the Android System Webview component. Error detail: " + e.message;
                }
                errorAudioContextWeb(e) {
                    return "There was a problem creating the AudioContext object. Please try updating your web browser. Error detail: " + e.message;
                }
                errorGlongsetBad(setName) { return "Unknown glongset " + setName; }
            };
            exports_1("MessagesEnglish", MessagesEnglish);
            MessagesThai = class MessagesThai {
                constructor() {
                    this.name = "ไทย";
                }
                errorAudioContextAndroid(e) {
                    return "เจอปัญหาตอนสร้าง AudioContext กรุณาลองอัปเดต Android System WebView ข้อมูลปัญหาคือ: " + e.message;
                }
                errorAudioContextWeb(e) {
                    return "เจอปัญหาตอนสร้าง AudioContext กรุณาลองอัปเดตเว็บบราว์เซอร์ ข้อมูลปัญหาคือ: " + e.message;
                }
                errorGlongsetBad(setName) { return "ไม่รู้จักชุดกลอง " + setName; }
            };
            exports_1("MessagesThai", MessagesThai);
        }
    };
});
