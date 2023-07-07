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
            result[p] = msgJoin(languages.map((l) => l[p]));
        }
        return result;
    }
    exports_1("makeMultilingual", makeMultilingual);
    return {
        setters: [],
        execute: function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9tZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CRTs7Ozs7SUErQkYsU0FBUyxPQUFPLENBQUMsSUFBVztRQUMxQixJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVE7WUFDNUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUV4QixPQUFPLENBQUMsR0FBRyxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsU0FBcUI7UUFDcEQsSUFBSSxNQUFNLEdBQVEsRUFBRSxDQUFBO1FBQ3BCLEtBQUssSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDckQ7UUFDRCxPQUFPLE1BQWtCLENBQUE7SUFDM0IsQ0FBQzs7Ozs7WUFuQ0Qsa0JBQUEsTUFBYSxlQUFlO2dCQUE1QjtvQkFDRSxTQUFJLEdBQUcsU0FBUyxDQUFBO2dCQVFsQixDQUFDO2dCQVBDLHdCQUF3QixDQUFDLENBQVE7b0JBQy9CLE9BQU8sMElBQTBJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtnQkFDL0osQ0FBQztnQkFDRCxvQkFBb0IsQ0FBQyxDQUFRO29CQUMzQixPQUFPLDRHQUE0RyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUE7Z0JBQ2pJLENBQUM7Z0JBQ0QsZ0JBQWdCLENBQUMsT0FBZSxJQUFJLE9BQU8sbUJBQW1CLEdBQUcsT0FBTyxDQUFBLENBQUMsQ0FBQzthQUMzRSxDQUFBOztZQUVELGVBQUEsTUFBYSxZQUFZO2dCQUF6QjtvQkFDRSxTQUFJLEdBQUcsS0FBSyxDQUFBO2dCQVFkLENBQUM7Z0JBUEMsd0JBQXdCLENBQUMsQ0FBUTtvQkFDL0IsT0FBTyxzRkFBc0YsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFBO2dCQUMzRyxDQUFDO2dCQUNELG9CQUFvQixDQUFDLENBQVE7b0JBQzNCLE9BQU8sNkVBQTZFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtnQkFDbEcsQ0FBQztnQkFDRCxnQkFBZ0IsQ0FBQyxPQUFlLElBQUksT0FBTyxtQkFBbUIsR0FBRyxPQUFPLENBQUEsQ0FBQyxDQUFDO2FBQzNFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXHTguYDguITguKPguLfguYjguK3guIfguInguLTguYjguIcgLyBLcmV1dW5nIENoaW5nXG4gIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBdXRvbWF0aWMgQ2hpbmcgcHJvZ3JhbSBmb3IgcHJhY3RpY2luZ1xuICBUaGFpIG11c2ljLlxuICBcbiAgQ29weXJpZ2h0IChDKSAyMDE5IERhdmlkIEJlc3dpY2sgPGRsYmVzd2lja0BnbWFpbC5jb20+XG5cbiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbiAgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlXG4gIExpY2Vuc2UsIG9yIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG5cbmludGVyZmFjZSBNZXNzYWdlcyB7XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZ1xuICBlcnJvckF1ZGlvQ29udGV4dEFuZHJvaWQoZTogRXJyb3IpOiBzdHJpbmdcbiAgZXJyb3JBdWRpb0NvbnRleHRXZWIoZTogRXJyb3IpOiBzdHJpbmdcbiAgZXJyb3JHbG9uZ3NldEJhZChzZXROYW1lOiBzdHJpbmcpOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VzRW5nbGlzaCBpbXBsZW1lbnRzIE1lc3NhZ2VzIHtcbiAgbmFtZSA9IFwiRW5nbGlzaFwiXG4gIGVycm9yQXVkaW9Db250ZXh0QW5kcm9pZChlOiBFcnJvcikge1xuICAgIHJldHVybiBcIlRoZXJlIHdhcyBhIHByb2JsZW0gY3JlYXRpbmcgdGhlIEF1ZGlvQ29udGV4dCBvYmplY3QuIFBsZWFzZSB0cnkgdXBkYXRpbmcgQ2hyb21lIG9yIHRoZSBBbmRyb2lkIFN5c3RlbSBXZWJ2aWV3IGNvbXBvbmVudC4gRXJyb3IgZGV0YWlsOiBcIiArIGUubWVzc2FnZVxuICB9XG4gIGVycm9yQXVkaW9Db250ZXh0V2ViKGU6IEVycm9yKSB7XG4gICAgcmV0dXJuIFwiVGhlcmUgd2FzIGEgcHJvYmxlbSBjcmVhdGluZyB0aGUgQXVkaW9Db250ZXh0IG9iamVjdC4gUGxlYXNlIHRyeSB1cGRhdGluZyB5b3VyIHdlYiBicm93c2VyLiBFcnJvciBkZXRhaWw6IFwiICsgZS5tZXNzYWdlXG4gIH1cbiAgZXJyb3JHbG9uZ3NldEJhZChzZXROYW1lOiBzdHJpbmcpIHsgcmV0dXJuIFwiVW5rbm93biBnbG9uZ3NldCBcIiArIHNldE5hbWUgfVxufVxuXG5leHBvcnQgY2xhc3MgTWVzc2FnZXNUaGFpIGltcGxlbWVudHMgTWVzc2FnZXMge1xuICBuYW1lID0gXCLguYTguJfguKJcIlxuICBlcnJvckF1ZGlvQ29udGV4dEFuZHJvaWQoZTogRXJyb3IpIHtcbiAgICByZXR1cm4gXCLguYDguIjguK3guJvguLHguI3guKvguLLguJXguK3guJnguKrguKPguYnguLLguIcgQXVkaW9Db250ZXh0IOC4geC4o+C4uOC4k+C4suC4peC4reC4h+C4reC4seC4m+C5gOC4lOC4lSBBbmRyb2lkIFN5c3RlbSBXZWJWaWV3IOC4guC5ieC4reC4oeC4ueC4peC4m+C4seC4jeC4q+C4suC4hOC4t+C4rTogXCIgKyBlLm1lc3NhZ2VcbiAgfVxuICBlcnJvckF1ZGlvQ29udGV4dFdlYihlOiBFcnJvcikge1xuICAgIHJldHVybiBcIuC5gOC4iOC4reC4m+C4seC4jeC4q+C4suC4leC4reC4meC4quC4o+C5ieC4suC4hyBBdWRpb0NvbnRleHQg4LiB4Lij4Li44LiT4Liy4Lil4Lit4LiH4Lit4Lix4Lib4LmA4LiU4LiV4LmA4Lin4LmH4Lia4Lia4Lij4Liy4Lin4LmM4LmA4LiL4Lit4Lij4LmMIOC4guC5ieC4reC4oeC4ueC4peC4m+C4seC4jeC4q+C4suC4hOC4t+C4rTogXCIgKyBlLm1lc3NhZ2VcbiAgfVxuICBlcnJvckdsb25nc2V0QmFkKHNldE5hbWU6IHN0cmluZykgeyByZXR1cm4gXCLguYTguKHguYjguKPguLnguYnguIjguLHguIHguIrguLjguJTguIHguKXguK3guIcgXCIgKyBzZXROYW1lIH1cbn1cblxuZnVuY3Rpb24gbXNnSm9pbih2YWxzOiBhbnlbXSk6IHN0cmluZyB8ICgoLi4uYTogYW55KSA9PiBzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiB2YWxzWzBdID09IFwic3RyaW5nXCIpXG4gICAgcmV0dXJuIHZhbHMuam9pbihcIiAvIFwiKTtcbiAgZWxzZVxuICAgIHJldHVybiAoLi4uYTogYW55KSA9PiB2YWxzLm1hcChmID0+IGYoLi4uYSkpLmpvaW4oXCIgLyBcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTXVsdGlsaW5ndWFsKGxhbmd1YWdlczogTWVzc2FnZXNbXSk6IE1lc3NhZ2VzIHtcbiAgbGV0IHJlc3VsdDogYW55ID0ge31cbiAgZm9yIChsZXQgcCBvZiBPYmplY3Qua2V5cyhsYW5ndWFnZXNbMF0pKSB7XG4gICAgcmVzdWx0W3BdID0gbXNnSm9pbihsYW5ndWFnZXMubWFwKChsOiBhbnkpID0+IGxbcF0pKVxuICB9XG4gIHJldHVybiByZXN1bHQgYXMgTWVzc2FnZXNcbn1cbiJdfQ==