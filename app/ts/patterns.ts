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

import { BpmControl } from './bpm.js';
import { GlongSet } from "./glongset.js"
import { Grammar, ParseRule, TerminalLit, TerminalRegex } from './lib/parser.js';

import { assert } from "./lib/assert.js"

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

// Drum patterns are working as a state-machine -- one state for instantaneous actions like BPM changes and
// one state for iterating through drum patterns, wait states, etc. This choice was made because I didn't want
// to create one object per note during the parsing phase, to save memory.
//
// Instantaneous actions are processed before timespan actions.
export class SegmentAction {
  instants:ActionInstant[] = []
  span?:ActionTimespan
  
  constructor(span?:ActionTimespan) {
    this.span = span
  }
}

export interface ActionInstant {
  run(bpm:BpmControl, isFirstTick:boolean)
}

export interface ActionTimespan {
  tick(glongSet:GlongSet, bpm:BpmControl):boolean
  seek(tickRelative:number):void
  length():number
}

class ActionWait implements ActionTimespan {
  private _tick:number
  constructor(private readonly _length:number) {}

  seek(tickRelative:number):void {
    assert(tickRelative < this.length())
    this._tick = tickRelative
  }

  length() { return this._length }
  
  tick(glongSet:GlongSet, bpm:BpmControl):boolean {
    return this._tick++ == bpm.ticksPerHong() * this.length()
  }
}

abstract class ActionBpm implements ActionInstant {
  constructor(private readonly time?:number) {}

  abstract bpmEnd(bpm:number):number
  
  run(bpm:BpmControl, isFirstTick:boolean) {
    const bpmEnd = this.bpmEnd(bpm.bpm())
    bpm.bpmRampHongs(bpmEnd, isFirstTick ? 0 : this.time ?? 6)
  }
}

class ActionBpmAbsolute extends ActionBpm {
  constructor(private readonly bpm:number, time?:number) {
    super(time)
  }

  bpmEnd(bpm:number):number { return this.bpm }
}

class ActionBpmFactor extends ActionBpm {
  constructor(private readonly factor:number, time?:number) {
    super(time)
  }

  bpmEnd(bpm:number):number { return bpm * this.factor }
}

class ActionEnd implements ActionInstant {
  constructor(private readonly time:number = 6) {}

  run(bpm:BpmControl, isFirstTick:boolean) {
    // Add a bit of hong of slowing (end on chup, default 6 hong)
    bpm.end(this.time + 0.1)
  }
}

class ActionChun implements ActionInstant {
  constructor(private readonly chun:number) {}

  run(bpm:BpmControl, isFirstTick:boolean) {
    bpm.chunSet(this.chun)
  }
}

class ActionDrumPattern implements ActionTimespan {
  private readonly _length:number
  private idx:number = 0

  private static readonly registers = /[^0-9x]/g
  
  constructor(private readonly pattern:string) {
    this._length = pattern.replace(ActionDrumPattern.registers,'').length    
  }

  seek(tickRelative:number):void {
    assert(tickRelative < this._length)
    this.idx = 0
    for (let tick = 0; tick != tickRelative; ++this.idx) {
      if (!ActionDrumPattern.registers.exec(this.pattern[this.idx])) {
        ++tick
      }
    }
  }
  
  length() { return this._length }
  
  tick(glongSet:GlongSet):boolean {
    assert(this.idx <= this.pattern.length)
    if (this.idx == this.pattern.length) {
      return true
    } else {
      const action = this.pattern[this.idx]
      if (action == 'x') {
        ++this.idx
      } else {
        const register = ActionDrumPattern.registers.exec(this.pattern[this.idx + 1] ?? '')
        glongSet.glong(0, register && register[0] == '.' ? 0.1 + Math.random()*0.1 : 1.0, Number(action))
        this.idx += register ? 2 : 1
      }
      return false
    }    
  }
}

export const grammar = new Grammar(
  [
	new TerminalRegex("REST", /^x/i, undefined, 'x'),
	new TerminalRegex("SPACE", /^\s+/),
	new TerminalRegex("DIGIT", /^\d/, 0),
	new TerminalLit("PERIOD", "."),
	new TerminalLit("PERCENT", "%"),
	new TerminalLit("SLASH", "/"),
	new TerminalRegex("BPM", /^BPM/i),
	new TerminalRegex("END", /^END/i),
	new TerminalRegex("WAIT", /^WAIT/i),
	new TerminalRegex("CHUN", /^CHUN/i),
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
		['chun'],
		['wait'],
	  ],
	  (nodes, ctx) => nodes[0].semantic(ctx)
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
        ['DIGIT', 'PERIOD', 'drumpattern'],
        ['DIGIT', 'drumpattern'],
        ['REST', 'drumpattern'],
        ['whitespace', 'drumpattern'],
        ['DIGIT', 'PERIOD'],
        ['DIGIT'],
        ['REST']
      ],
	  (nodes, ctx) => {
        let pattern = ""
		while (true) {
          for (const n of nodes)
		    pattern += n.lexeme ?? ''
		  if (nodes[nodes.length-1].nodes) {
			nodes = nodes[nodes.length-1].nodes
		  } else {
			break
		  }
		}

        const action = new ActionDrumPattern(pattern)
        if (ctx[ctx.length-1]?.span)
          ctx.push(new SegmentAction(action))
        else
          ctx[ctx.length-1].span = action
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
	  (nodes, ctx) => {
        if (ctx[ctx.length-1].span)
          ctx.push(new SegmentAction())
        
        const value = nodes[1].semantic()
        const time = nodes[nodes.length-1]?.semantic()
        if (nodes.length == 2 || nodes.length == 4)
          ctx[ctx.length-1].instants.push(new ActionBpmAbsolute(value, time))
        else
          ctx[ctx.length-1].instants.push(new ActionBpmFactor(value / 100, time))
      }
	),
	new ParseRule(
	  'end',
	  [['END', 'SLASH', 'number'],
       ['END']],
	  (nodes, ctx:SegmentAction[]) => {
        if (ctx[ctx.length-1].span)
          ctx.push(new SegmentAction())
        ctx[ctx.length-1].instants.push(new ActionEnd(nodes[2]?.semantic()))
      }
	),
	new ParseRule(
	  'chun',
	  [['CHUN', 'number']],
	  (nodes, ctx:SegmentAction[]) => {
        if (ctx[ctx.length-1].span)
          ctx.push(new SegmentAction())
        ctx[ctx.length-1].instants.push(new ActionChun(nodes[1]?.semantic()))
      }
	),
	new ParseRule(
	  'wait',
	  [['WAIT', 'number']],
	  (nodes, ctx:SegmentAction[]) => {
        const action = new ActionWait(nodes[1].semantic())
        if (ctx[ctx.length-1].span)
          ctx.push(new SegmentAction(action))
        else
          ctx[ctx.length-1].span = action
      }
	)
  ]
)
