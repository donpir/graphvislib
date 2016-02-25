/*
 ** This file is part of MuViz.
 **
 ** MuViz is free software: you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation, either version 3 of the License, or
 ** (at your option) any later version.
 **
 ** MuViz is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with MuViz. If not, see <http://www.gnu.org/licenses/>.
 **
 ** Copyright (C) 2016 MuViz - Donato Pirozzi (donatopirozzi@gmail.com)
 ** Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 ** License: http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 **/


function ArrayUtils() {}

ArrayUtils.prototype = (function() {

    return {
        constructor: ArrayUtils,

        commonSubArray: function(arr1, arr2) {
            var ptr = { arr1: { start: 0, end: 0 }, arr2: { start: 0, end: 0 } };

            var lastEqualLength = 0;
            var max = null;

            while (ptr.arr1.end < arr1.length && ptr.arr2.end < arr2.length)
                if (arr1[ptr.arr1.end] == arr2[ptr.arr2.end]) {
                    ptr.arr1.end++; ptr.arr2.end++;
                } else {
                    var curLength = ptr.arr1.end - ptr.arr1.start;
                    if (curLength > lastEqualLength) max = ptr;
                    ptr = { arr1: { start: ptr.arr1.start+1, end: ptr.arr1.start+1 },
                            arr2: { start: 0, end: 0 } };
                }

        }//EndFunction.
    }
})();