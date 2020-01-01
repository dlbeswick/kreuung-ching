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

const time = (desc, func) => {
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

const replacer = (key, val) => {
  if (val != null && typeof val === "object" && typeof val.inspect === "function") {
	return val.inspect()
  } else {
	return val
  }
}

const log = (s,pretty=false) => {
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
  window.onerror = (a,b,c,d,e) => {
	body.textContent += "\n" + a +  "\nLine " + c + ":" + d + "\n"
  }

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
			  nodes = nodes[1].nodes
			} else if (nodes.length == 3) {
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
BPM9999xxxx  xxxx x231---- 0-231\n\
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
  ]

  inputs.forEach(([input, shouldSucceed]) => {
	log(input)

	const tokens = grammar.tokenize(input)
	
	log("Tokens:")
	log(tokens)

	log("")

	const [semantics, state] = grammar.parse(tokens)
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

  profile(grammar)
}

function profile(grammar) {
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
  time('parse + semantic', () => grammar.parse(tokens))
}

document.addEventListener("DOMContentLoaded", test)
