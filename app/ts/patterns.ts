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

import { Grammar, ParseRule, TerminalLit, TerminalRegex } from './lib/parser.js';

export const patternGabber="023231010xx1515234x26231";

export const dahmNoyJaiYah=
  "1xxxx01xxxx01xx0 \n" +
  "1xxxx01xxxx01xx0 \n" +
  "1xxxx01xxxx01xx0 \n" +
  "1xxxx01xxxx01xx0 \n" +
  "\n"                  +
  "1xxxx01xxxx01xx0 \n" +
  "1xxxxx1xxxx01xx0 \n" +
  "1xxxx0101xx01xx0 \n" +
  "1xxxx01xxxx01xx0 \n" ;

export const pleyngDahmLao=
  "0x1x3x1x1xxx0x1x \n" +
  "0x1x3x1x1xxx0x1x \n" +
  "0x1x3x1x1xxx0x1x \n" +
  "0x1x3x131xxx0x1x \n" +
  "\n"                  +
  "0x1x3x1x1xxx0x1x \n" +
  "0x1x3x1x1xxx0x1x \n" +
  "0x1x3x1x1xxx0x1x \n" +
  "0x1x3x131x010x1x \n" ;

export const pleyngDahmKhmen=
  "0xx23x1x0x1x01x2 \n" +
  "3xx23x2x3x2x3x1x \n" +
  "0xx23x1x0x1x01x2 \n" +
  "3xx232323x123101 \n" +
  "\n"                  +
  "0xx23x110x1x01x2 \n" +
  "3xx2323232323x11 \n" +
  "0xx23x11023101x2 \n" +
  "3xxxx23232323101 \n" ;

export const pleyngKhmenOmDteuk="# เขมรอมตึ๊ก ท่อน ๑\n" +
  "# https://www.youtube.com/watch?v=cv5B4roT0Bo\n" +
  "xxxxxxxx \n"+	
  "xxxxxxxx xx1101x2\n"+
  "3xx23x2x 3x2x3x1x\n"+
  "0xx23x1x 0x1x01x2\n"+
  "3xx23232 3x123101\n"+
  "0xx23x11 023101x2\n"+
  "3xx23232 32323x11\n"+
  "0xx23x11 023101x2\n"+
  "\n" +
  "3xxxx232 32323101\n"+
  "0xx23101 023101x2\n"+
  "3xx23232 32323101\n"+
  "0xx23101 023101x2\n"+
  "3xx23232 3x123x11\n"+
  "0xx23x11 023101x2\n"+
  "3xx23232 32323101\n"+
  "02323101 023101x2\n"+
  "\n" +
  "3xx23232 32323101\n"+
  "0xx23x11 023101x2\n"+
  "3xx23232 33123101\n"+
  "0xx23x1x 023101x2\n"+
  "3xx23232 3x123311\n"+
  "0xx23x11 023101x2\n"+
  "3xx23232 32323101\n"+
  "0xx23x11 023101x2\n"+
  "3xx23232 32323101\n"+
  "0xx23101 023101x2\n"+
  "3xx23232 32323101\n"+
  "02323101 023102x3\n"+
  "3xx23232 32323101\n"+
  "\n" +
  "0xx23101 023101x2\n"+
  "3xx23232 32323101\n"+
  "0xx23101 023101x2\n"+
  "3xx23232 3x123x11\n"+
  "0xx23x11 023101x2\n"+
  "3xx23232 32323101\n"+
  "02323101 023101x2\n"+
  "3xx23232 32323101\n"+
  "\n" +
  "0xx23101 023101x2\n"+
  "3xx23232 32323101\n"+
  "0xx23101 023101x2\n"+
  "3xx23232 3x123x11\n"+
  "0xx23x11 023101x2\n"+
  "3xx23232 32323101\n"+
  "02323101 023101x2\n"+
  "3xx23232 32323101\n"+
  "\n" +
  "0xx23x11 023101x2\n"+
  "3xx23232 33123101\n"+
  "0xx23x1x 023101x2\n"+
  "3xx23232 3x123311\n"+
  "0xx23x11 023101x2\n"+
  "3xx23232 32323101\n"+
  "0xx23x11 023101x2\n"+
  "3xx23232 32323101\n"+
  "0xx23101 023101x2\n"+
  "3xx23232 32323101\n"+
  "\n" +
  "END\n"+
  "02323101 023102x3\n"+
  "xxxxxxxx xxxxxxxx\n"+
  "\n";

const actionEnd = {action: "end"}
export const grammar = new Grammar(
  [
	new TerminalRegex("REST", /^x/i, undefined, 'x'),
	new TerminalRegex("SPACE", /^\s+/),
	new TerminalRegex("DIGIT", /^\d/, 0),
	new TerminalLit("PERCENT", "%"),
	new TerminalLit("SLASH", "/"),
	new TerminalRegex("BPM", /^BPM/i),
	new TerminalRegex("END", /^END/i),
	new TerminalRegex("COMMENT", /^#.*/),
  ],
  [
	new ParseRule(
	  'score',
	  [
		['COMMENT'],
		['whitespace'],
		['drumpattern'],
		['bpm'],
		['end'],
	  ],
	  (nodes) => nodes[0].semantic()
	),
	new ParseRule(
	  'whitespace',
	  [
		['SPACE', 'whitespace'],
		['SPACE']
	  ],
	  (nodes) => null
	),
	new ParseRule(
	  'number',
	  [
		['DIGIT', 'number'],
		['DIGIT'],
	  ],
	  (nodes) => {
		let digits = ""
		while (true) {
		  digits += nodes[0].lexeme
		  if (nodes.length == 2) {
			nodes = nodes[1].nodes
		  } else {
			return Number(digits)
		  }
		}
	  }
	),
	new ParseRule(
	  'drumpattern',
	  [
        ['DIGIT', 'drumpattern'],
        ['REST', 'drumpattern'],
        ['whitespace', 'drumpattern'],
        ['DIGIT'],
        ['REST']
      ],
	  (nodes) => {
        let pattern = ""
		while (true) {
		  pattern += nodes[0].lexeme ?? ''
		  if (nodes.length == 2) {
			nodes = nodes[1].nodes
		  } else {
			break
		  }
		}

        return { action: "drumpattern", pattern: pattern, length: pattern.length }
      }
	),
	new ParseRule(
	  'bpm',
	  [
		['BPM', 'number', 'PERCENT', 'SLASH', 'number'],
		['BPM', 'number', 'SLASH', 'number'],
		['BPM', 'number', 'PERCENT'],
        ['BPM', 'number'],
      ],
	  (nodes) => {
        const time = nodes.length > 3 ? nodes[nodes.length-1].semantic() : 15
        if (nodes.length == 2)
          return {action: "bpm", bpm: nodes[1].semantic(), time: time}
        else
          return {action: "bpm", factor: nodes[1].semantic() / 100, time: time}
      }
	),
	new ParseRule(
	  'end',
	  [['END']],
	  (_) => actionEnd
	)
  ]
)


