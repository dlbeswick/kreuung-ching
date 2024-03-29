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

import { assert } from './lib/assert.js';
import { Grammar, ParseRule, TerminalLit, TerminalRegex } from './lib/parser.js';

const time = (desc: string, func: () => void) => {
  const start = window.performance.now()
  let i = 0;
  for (; i < 1000; ++i) {
	func()
	if (window.performance.now() - start > 5000) {
	  break;
	}
  }
  const end = window.performance.now()

  const result = desc + " average over " + i + " runs: " + ((end - start) / (i+1)) + " ms"
  console.debug(result)
  log(result)
}

const replacer = (key: string, val: any) => {
  if (val != null && typeof val === "object" && typeof val.inspect === "function") {
	return val.inspect()
  } else {
	return val
  }
}

const log = (s: any, pretty=false) => {
  const body = document.getElementsByTagName("pre")[0]

  if (typeof s === 'string') {
	body.textContent += s + "\n"
  } else {
	if (pretty) {
	  body.textContent += JSON.stringify(s, replacer, 2) + "\n"
	} else {
	  body.textContent += JSON.stringify(s, replacer) + "\n"
	}
  }
}

function test() {
  const actionEnd = {action: "end"}
  const grammar = new Grammar(
	[
	  new TerminalLit("REST", "x"),
	  new TerminalRegex("SPACE", /^\s+/),
	  new TerminalRegex("DIGIT", /^\d/, 0),
	  new TerminalLit("DASH", "-"),
	  new TerminalLit("BPM", "BPM"),
	  new TerminalLit("END", "END")
	],
	[
	  new ParseRule(
		'score',
		[
		  ['rest'],
		  ['whitespace'],
		  ['note-roowa'],
		  ['note'],
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
		'rest',
		[
		  ['REST', 'rest'],
		  ['REST', 'whitespace', 'rest'],
		  ['REST']
		],
		(nodes) => {
		  const action = {action: 'rest', ticks: 0}
		  while (true) {
			action.ticks += 1
			if (nodes.length == 2) {
              assert(nodes[1].nodes)
			  nodes = nodes[1].nodes
			} else if (nodes.length == 3) {
              assert(nodes[2].nodes)
			  nodes = nodes[2].nodes
			} else {
			  return action
			}
		  }
		}
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
              assert(nodes[1].nodes)
			  nodes = nodes[1].nodes
			} else {
			  return Number(digits)
			}
		  }
		}
	  ),
	  new ParseRule(
		'note-roowa+',
		[
		  ['DASH', 'note-roowa+'],
		  ['DASH']
		],
		(nodes) => {
		  let length = 0
		  while (true) {
			length += 1
			if (nodes.length == 2) {
              assert(nodes[1].nodes)
			  nodes = nodes[1].nodes
			} else {
			  return {tickRoowa: length}
			}
		  }
		}
	  ),
	  new ParseRule(
		'note-roowa',
		[['note', 'note-roowa+']],
		(nodes) => Object.assign(nodes[0].semantic(), nodes[1].semantic())
	  ),
	  new ParseRule(
		'note',
		[['DIGIT']],
		(nodes) => { return {action: "note", note: Number(nodes[0].lexeme)} }
	  ),
	  new ParseRule(
		'bpm',
		[['BPM', 'number']],
		(nodes) => { return {action: "bpm", bpm: nodes[1].semantic()} }
	  ),
	  new ParseRule(
		'end',
		[['END']],
		(nodes) => actionEnd
	  )
	]
  )

  const body = document.getElementsByTagName("pre")[0]

  const inputb = "\
BPM9999\n0xxxx  xxxx x231---- 0-231\n\
BPM70\n\
xxxx xxxx x231 0231\n\
END\n\
xxxx xxxx xxxx xxxx\
"
  
  const inputs = [
	[inputb, true],
	["BPM70 BPM60 END", true],
	["BPM 70 BPM60 END", false],
	["BPM", false],
	["BPM999xBPM888", true]
  ] as const

  inputs.forEach(([input, shouldSucceed]) => {
	log(input)

	const tokens = grammar.tokenize(input)
	
	log("Tokens:")
	log(tokens)

	log("")

	const [semantics, state] = grammar.parse(tokens[0], [])
	if (state.error) {
	  log(state.error + "\n" + state.context())
	  if (shouldSucceed) {
		console.error("FAILED")
	  } else {
		log("OK")
	  }
	} else {
	  log("Semantics:")
	  log(semantics, true)
	  if (shouldSucceed) {
		log("OK")
	  } else {
		console.error("FAILED")
	  }
	}
  })

  window.setTimeout(() => profile(grammar), 1000)
}

function profile(grammar: Grammar) {
  const inputb = "\
xxxx xxxx x231--- 0231-\n\
BPM70\n\
xxxx xxxx x231 0231\n\
END\n\
xxxx xxxx xxxx xxxx\
"
  
  const input = inputb.repeat(100)
  const tokens = grammar.tokenize(input)
  log('Input size ' + input.length)
  time('tokenize', () => grammar.tokenize(input))
  time('parse + semantic', () => grammar.parse(tokens[0], []))
}

function test2() {
  const actionEnd = {action: "end"}
  const grammar = new Grammar(
	[
	  new TerminalRegex("REST", /^x/i, undefined, 'x'),
	  new TerminalRegex("SPACE", /^\s+/),
	  new TerminalRegex("DIGIT", /^\d/, 0),
	  new TerminalLit("PERCENT", "%"),
	  new TerminalLit("SLASH", "/"),
	  new TerminalRegex("BPM", /^BPM/i),
	  new TerminalRegex("END", /^END/i)
	],
	[
	  new ParseRule(
		'score',
		[
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
              assert(nodes[1].nodes)
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
              assert(nodes[1].nodes)
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
            return {action: "bpmFactor", factor: (nodes[1].semantic() as number) / 100, time: time}
        }
	  ),
	  new ParseRule(
		'end',
		[['END']],
		(_) => actionEnd
	  )
	]
  )

  const body = document.getElementsByTagName("pre")[0]

  const input = "\
BPM9999\n0xxxx  xxxx x231 0231\n\
BPM111%\n\
xxxx xxxx x22 333 4444\n\
BPM111%/30\n\
xxxx xxxx xxxx xxxx\
BPM80/60\n\
xxxx xxxx xxxx xxxx\
END\n\
xxxx xxxx xxxx xxxx\
"

  const tokens = grammar.tokenize(input)
  
  log("Tokens:")
  log(tokens)

  log("")

  const [semantics, state] = grammar.parse(tokens[0], [])
  if (state.error) {
	log(state.error + "\n" + state.context())
  } else {
	log("Semantics:")
	log(semantics, true)
  }
}

window.onerror = (a,b,c,d,e) => {
  document.getElementsByTagName("pre")[0].textContent += "\n" + a +  "\nLine " + c + ":" + d + "\n"
}

//document.addEventListener("DOMContentLoaded", test)
document.addEventListener("DOMContentLoaded", test2)
