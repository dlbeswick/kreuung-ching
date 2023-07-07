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
    var invBits32, RandLcg, Test;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            invBits32 = 2 ** -32;
            RandLcg = class RandLcg {
                constructor(seed = (new Date).getTime()) {
                    this.multiplier = 1103515245;
                    this.increment = 12345;
                    this.state = seed;
                }
                int32() {
                    this.state = Math.imul(this.state + this.increment, this.multiplier);
                    return this.state >>> 0;
                }
                rand(start, end) {
                    return start + (end - start) * this.int32() * invBits32;
                }
                irand(start, endExclusive) {
                    return Math.trunc(start + (endExclusive - start) * (this.int32() - 1) * invBits32);
                }
            };
            exports_1("RandLcg", RandLcg);
            (function (Test) {
                // All values should be evenly distributed over each choice.
                // Return a measure of how far each value deviates from that ideal.
                function intDeviation(r, choices) {
                    const vals = Array(choices);
                    const cnt = 1e7;
                    vals.fill(0, 0, choices);
                    for (let i = 0; i < cnt; ++i)
                        vals[r.irand(0, choices)] += 1;
                    return vals.map(e => e / (cnt / choices));
                }
                Test.intDeviation = intDeviation;
            })(Test || (Test = {}));
            exports_1("Test", Test);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3RzL2xpYi9yYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBbUJFOzs7Ozs7OztZQUVFLFNBQVMsR0FBRyxDQUFDLElBQUUsQ0FBQyxFQUFFLENBQUE7WUFRdEIsVUFBQSxNQUFhLE9BQU87Z0JBS2xCLFlBQVksSUFBSSxHQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7b0JBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO29CQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtvQkFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7Z0JBQ25CLENBQUM7Z0JBRUQsS0FBSztvQkFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtvQkFDcEUsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQTtnQkFDekIsQ0FBQztnQkFFRCxJQUFJLENBQUMsS0FBYSxFQUFFLEdBQVc7b0JBQzdCLE9BQU8sS0FBSyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxTQUFTLENBQUE7Z0JBQ3pELENBQUM7Z0JBRUQsS0FBSyxDQUFDLEtBQWEsRUFBRSxZQUFvQjtvQkFDdkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQTtnQkFDcEYsQ0FBQzthQUNGLENBQUE7O1lBRUQsV0FBaUIsSUFBSTtnQkFDbkIsNERBQTREO2dCQUM1RCxtRUFBbUU7Z0JBQ25FLFNBQWdCLFlBQVksQ0FBQyxDQUFNLEVBQUUsT0FBYztvQkFDakQsTUFBTSxJQUFJLEdBQVUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO29CQUNsQyxNQUFNLEdBQUcsR0FBQyxHQUFHLENBQUE7b0JBRWIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFBO29CQUV0QixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQzt3QkFDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO29CQUUvQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtnQkFDekMsQ0FBQztnQkFWZSxpQkFBWSxlQVUzQixDQUFBO1lBQ0gsQ0FBQyxFQWRnQixJQUFJLEtBQUosSUFBSSxRQWNwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cdOC5gOC4hOC4o+C4t+C5iOC4reC4h+C4ieC4tOC5iOC4hyAvIEtyZXV1bmcgQ2hpbmdcbiAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEF1dG9tYXRpYyBDaGluZyBwcm9ncmFtIGZvciBwcmFjdGljaW5nXG4gIFRoYWkgbXVzaWMuXG4gIFxuICBDb3B5cmlnaHQgKEMpIDIwMTkgRGF2aWQgQmVzd2ljayA8ZGxiZXN3aWNrQGdtYWlsLmNvbT5cblxuICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhc1xuICBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGVcbiAgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cblxubGV0IGludkJpdHMzMiA9IDIqKi0zMlxuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmQge1xuICBpbnQzMigpOm51bWJlclxuICByYW5kKHN0YXJ0Om51bWJlciwgZW5kOm51bWJlcik6bnVtYmVyXG4gIGlyYW5kKHN0YXJ0Om51bWJlciwgZW5kRXhjbHVzaXZlOm51bWJlcik6bnVtYmVyXG59XG5cbmV4cG9ydCBjbGFzcyBSYW5kTGNnIHtcbiAgbXVsdGlwbGllcjpudW1iZXJcbiAgaW5jcmVtZW50Om51bWJlclxuICBzdGF0ZTpudW1iZXJcblxuICBjb25zdHJ1Y3RvcihzZWVkPShuZXcgRGF0ZSkuZ2V0VGltZSgpKSB7XG4gICAgdGhpcy5tdWx0aXBsaWVyID0gMTEwMzUxNTI0NVxuICAgIHRoaXMuaW5jcmVtZW50ID0gMTIzNDVcbiAgICB0aGlzLnN0YXRlID0gc2VlZFxuICB9XG5cbiAgaW50MzIoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IE1hdGguaW11bCh0aGlzLnN0YXRlICsgdGhpcy5pbmNyZW1lbnQsIHRoaXMubXVsdGlwbGllcilcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSA+Pj4gMFxuICB9XG5cbiAgcmFuZChzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcikge1xuICAgIHJldHVybiBzdGFydCArIChlbmQgLSBzdGFydCkgKiB0aGlzLmludDMyKCkgKiBpbnZCaXRzMzJcbiAgfVxuXG4gIGlyYW5kKHN0YXJ0OiBudW1iZXIsIGVuZEV4Y2x1c2l2ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIE1hdGgudHJ1bmMoc3RhcnQgKyAoZW5kRXhjbHVzaXZlIC0gc3RhcnQpICogKHRoaXMuaW50MzIoKSAtIDEpICogaW52Qml0czMyKVxuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgVGVzdCB7XG4gIC8vIEFsbCB2YWx1ZXMgc2hvdWxkIGJlIGV2ZW5seSBkaXN0cmlidXRlZCBvdmVyIGVhY2ggY2hvaWNlLlxuICAvLyBSZXR1cm4gYSBtZWFzdXJlIG9mIGhvdyBmYXIgZWFjaCB2YWx1ZSBkZXZpYXRlcyBmcm9tIHRoYXQgaWRlYWwuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnREZXZpYXRpb24ocjpSYW5kLCBjaG9pY2VzOm51bWJlcikge1xuICAgIGNvbnN0IHZhbHM6bnVtYmVyW109QXJyYXkoY2hvaWNlcylcbiAgICBjb25zdCBjbnQ9MWU3XG5cbiAgICB2YWxzLmZpbGwoMCwwLGNob2ljZXMpXG5cbiAgICBmb3IgKGxldCBpPTA7IGk8Y250OyArK2kpXG4gICAgICB2YWxzW3IuaXJhbmQoMCxjaG9pY2VzKV0gKz0gMVxuXG4gICAgcmV0dXJuIHZhbHMubWFwKGUgPT4gZSAvIChjbnQvY2hvaWNlcykpXG4gIH1cbn1cbiJdfQ==