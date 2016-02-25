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

function InputParser() {}

InputParser.prototype = (function() {

    return {
        constructor: InputParser,

        parseStringOfDiffsNotes: function(stringOfNotes) {
            var notes = [];

            var arrNoteBlocks = stringOfNotes.split("*");
            for (var i=0; i<arrNoteBlocks.length; i++) {
                var sNoteBlock = arrNoteBlocks[i];
                var _tmp = sNoteBlock.split("(");

                if (_tmp.length != 2)
                    throw "Cannot split the block of notes |" + sNoteBlock + "|";

                var diff = parseInt(_tmp[0]);
                var duration = _tmp[1].substring(0, _tmp[1].length - 1);

                var splitDuration = duration.split("/");
                var durationFloat = parseInt(splitDuration[0]) / parseInt(splitDuration[1]);

                notes.push({ durationString: duration, durationFloat: durationFloat, noteDiffWithPrev: diff });
            }

            return notes;
        },//EndFunction.

        parseStringOfDiffsNotesToChartSeries: function(songName, stringOfNotes) {
            var arrDiffNotes = this.parseStringOfDiffsNotes(stringOfNotes);
            var arrSeries = [ songName ];

            for (var i=0; i<arrDiffNotes.length; i++) {
                var diffNote = arrDiffNotes[i];
                arrSeries.push( diffNote.noteDiffWithPrev );
            }//EndFor.

            return arrSeries;
        },//EndFunction.

        parseStringOfDiffsNotesToChartSeriesWithDuration: function(songName, stringOfNotes) {
            var arrDiffNotes = this.parseStringOfDiffsNotes(stringOfNotes);
            var arrSeries = [ songName ];

            for (var i=0; i<arrDiffNotes.length; i++) {
                var diffNote = arrDiffNotes[i];
                var duration = diffNote.durationFloat * 16;
                for (var j=0; j<duration; j++)
                    arrSeries.push( diffNote.noteDiffWithPrev );
            }//EndFor.

            return arrSeries;
        }//EndFunction.
    };

})();