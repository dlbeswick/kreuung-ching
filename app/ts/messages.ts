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

namespace Messages {
  interface Messages {
    readonly name: string
    readonly errorAudioContextAndroid: (e:Error) => string
    readonly errorAudioContextWeb: (e:Error) => string
  }

  export let en: Messages = {
    name: "English",
    errorAudioContextAndroid: (e:Error) => {
      return "There was a problem creating the AudioContext object. Please try updating Chrome or the Android System Webview component. Error detail: " + e.message
    },
    errorAudioContextWeb: (e:Error) => {
      return "There was a problem creating the AudioContext object. Please try updating your web browser. Error detail: " + e.message
    }
  }

  export let th: Messages = {
    name: "ไทย",
    errorAudioContextAndroid: (e:Error) => {
      return "เจอปัญหาตอนสร้าง AudioContext กรุณาลองอัปเดต Android System WebView ข้อมูลปัญหาคือ: " + e.message
    },
    errorAudioContextWeb: (e:Error) => {
      return "เจอปัญหาตอนสร้าง AudioContext กรุณาลองอัปเดตเว็บบราว์เซอร์ ข้อมูลปัญหาคือ: " + e.message
    }
  }

  function msgJoin(vals:any[]): string | ((...a:any) => string) {
    if (typeof vals[0] == "string")
      return vals.join(" / ");
    else
      return (...a:any) => vals.map(f => f(...a)).join(" / ");
  }
  
  export function makeMultilingual(languages:Messages[]): Messages {
    let result = {}
    for (let p of Object.keys(languages[0])) {
      result[p] = msgJoin(languages.map(l => l[p]))
    }
    return result as Messages
  }
}
