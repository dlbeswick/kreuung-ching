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

namespace Rand {
  let invBits32 = 2**-32

  export interface Rand {
    int32():number
    rand(start:number, end:number):number
    irand(start:number, endExclusive:number):number
  }

  export class RandLcg {
    multiplier:number
    increment:number
    state:number

    constructor(seed=(new Date).getTime()) {
      this.multiplier = 1103515245
      this.increment = 12345
      this.state = seed
    }

    int32() {
      this.state = Math.imul(this.state + this.increment, this.multiplier)
      return this.state >>> 0
    }

    rand(start, end) {
      return start + (end - start) * this.int32() * invBits32
    }

    irand(start, endExclusive) {
      return Math.trunc(start + (endExclusive - start) * (this.int32() - 1) * invBits32)
    }
  }
  
  export namespace Test {
    // All values should be evenly distributed over each choice.
    // Return a measure of how far each value deviates from that ideal.
    export function intDeviation(r:Rand, choices:number) {
      const vals:number[]=Array(choices)
      const cnt=1e7

      vals.fill(0,0,choices)

      for (let i=0; i<cnt; ++i)
        vals[r.irand(0,choices)] += 1

      return vals.map(e => e / (cnt/choices))
    }
  }
}
