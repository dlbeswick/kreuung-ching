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
    var __moduleName = context_1 && context_1.id;
    function makeShaper(audioCtx, inputs, filterOnlyInputs, factorA = 1, factorB = 1, shift = 1, oversample = '4x', highpass = 20) {
        const shaper = audioCtx.createWaveShaper();
        const curve = new Float32Array(44100);
        for (let i = 0; i < 44100; ++i) {
            const x = i / 44100.0;
            const valA = -1.0 / (1.0 + Math.exp(shift - x * factorA));
            const valB = -1.0 / (1.0 + Math.exp(shift - x * factorB));
            curve[i] = valA + (valB - valA) * Math.pow(x, 2);
        }
        shaper.curve = curve;
        shaper.oversample = oversample;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = highpass;
        shaper.connect(filter);
        for (let i of inputs)
            i.connect(shaper);
        for (let i of filterOnlyInputs)
            i.connect(filter);
        return filter;
    }
    exports_1("makeShaper", makeShaper);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvc2hhcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBbUJFOzs7O0lBYUYsU0FBZ0IsVUFBVSxDQUFDLFFBQXNCLEVBQUUsTUFBb0IsRUFBRSxnQkFBOEIsRUFDNUUsT0FBTyxHQUFDLENBQUMsRUFBRSxPQUFPLEdBQUMsQ0FBQyxFQUFFLEtBQUssR0FBQyxDQUFDLEVBQUUsYUFBNkIsSUFBSSxFQUFFLFFBQVEsR0FBQyxFQUFFO1FBRXRHLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQzFDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFDLE9BQU8sQ0FBQTtZQUNuQixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQTtZQUN6RCxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQTtZQUN6RCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ2hEO1FBQ0QsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDcEIsTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7UUFFOUIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUE7UUFDNUMsTUFBTSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUE7UUFDeEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFBO1FBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFdEIsS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNO1lBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN2QyxLQUFLLElBQUksQ0FBQyxJQUFJLGdCQUFnQjtZQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFakQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcblx04LmA4LiE4Lij4Li34LmI4Lit4LiH4LiJ4Li04LmI4LiHIC8gS3JldXVuZyBDaGluZ1xuICBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQXV0b21hdGljIENoaW5nIHByb2dyYW0gZm9yIHByYWN0aWNpbmdcbiAgVGhhaSBtdXNpYy5cbiAgXG4gIENvcHlyaWdodCAoQykgMjAxOSBEYXZpZCBCZXN3aWNrIDxkbGJlc3dpY2tAZ21haWwuY29tPlxuXG4gIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzXG4gIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZVxuICBMaWNlbnNlLCBvciAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuXG4vKipcbiAqIFdhdmVzaGFwZXIgZnJvbSBtb2RpZmllZCBzaWdtb2lkIGN1cnZlLlxuICogVGhpcyBmdW5jdGlvbiBjYW4gcHJvZHVjZSBsb3ctZnJlcXVlbmN5IGFydGlmYWN0cyB0aGF0IHdpbGwgbmVlZCB0byBiZSBmaWx0ZXJlZCBhd2F5LlxuICpcbiAqIFwiRmFjdG9yXCIgYWZmZWN0cyBjdXJ2ZSBzbG9wZS4gRmluYWwgZmFjdG9yIHZhbHVlIGlzIGludGVycG9sYXRlZCBmcm9tIGEgYW5kIGIgZnJvbSAwIHRvIDEuXG4gKiBDaG9vc2UgZXF1YWwgZmFjdG9ycyBmb3Igc3ltbWV0cmljIGRpc3RvcnRpb24gKG9kZCBoYXJtb25pY3MpLCBvciB1bmVxdWFsIGZvciBhc3ltZXRyaWMgKGV2ZW4gaGFybW9uaWNzKS5cbiAqL1xuaW1wb3J0IHtcbiAgSW5zdHJ1bWVudFxufSBmcm9tIFwiLi9pbnN0cnVtZW50LmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlU2hhcGVyKGF1ZGlvQ3R4OiBBdWRpb0NvbnRleHQsIGlucHV0czogSW5zdHJ1bWVudFtdLCBmaWx0ZXJPbmx5SW5wdXRzOiBJbnN0cnVtZW50W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmYWN0b3JBPTEsIGZhY3RvckI9MSwgc2hpZnQ9MSwgb3ZlcnNhbXBsZTogT3ZlclNhbXBsZVR5cGUgPSAnNHgnLCBoaWdocGFzcz0yMCkge1xuICBcbiAgY29uc3Qgc2hhcGVyID0gYXVkaW9DdHguY3JlYXRlV2F2ZVNoYXBlcigpXG4gIGNvbnN0IGN1cnZlID0gbmV3IEZsb2F0MzJBcnJheSg0NDEwMClcbiAgZm9yIChsZXQgaT0wOyBpIDwgNDQxMDA7ICsraSkge1xuICAgIGNvbnN0IHggPSBpLzQ0MTAwLjBcbiAgICBjb25zdCB2YWxBID0gLTEuMCAvICgxLjAgKyBNYXRoLmV4cChzaGlmdCAtIHggKiBmYWN0b3JBKSlcbiAgICBjb25zdCB2YWxCID0gLTEuMCAvICgxLjAgKyBNYXRoLmV4cChzaGlmdCAtIHggKiBmYWN0b3JCKSlcbiAgICBjdXJ2ZVtpXSA9IHZhbEEgKyAodmFsQiAtIHZhbEEpICogTWF0aC5wb3coeCwyKVxuICB9XG4gIHNoYXBlci5jdXJ2ZSA9IGN1cnZlXG4gIHNoYXBlci5vdmVyc2FtcGxlID0gb3ZlcnNhbXBsZVxuICBcbiAgY29uc3QgZmlsdGVyID0gYXVkaW9DdHguY3JlYXRlQmlxdWFkRmlsdGVyKClcbiAgZmlsdGVyLnR5cGUgPSAnaGlnaHBhc3MnXG4gIGZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBoaWdocGFzc1xuICBzaGFwZXIuY29ubmVjdChmaWx0ZXIpXG5cbiAgZm9yIChsZXQgaSBvZiBpbnB1dHMpIGkuY29ubmVjdChzaGFwZXIpXG4gIGZvciAobGV0IGkgb2YgZmlsdGVyT25seUlucHV0cykgaS5jb25uZWN0KGZpbHRlcilcbiAgXG4gIHJldHVybiBmaWx0ZXJcbn1cbiJdfQ==