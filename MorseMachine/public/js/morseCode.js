        // Create a model for the Morse Code interpreter.
        var morseCode = (function(){
            // Define the desired note frequency in Hz
            this._freq = 440;
            // Define the desired code speed in words per minute
            // Note that code via a keeyboard is harder than with a key so this will probably be lower that normal key speed
            this._speed = 12;
            // Define the duration of the dot in milliseconds. Duration is calculated as 1200/speed (wpm)
            this._dotDuration = (1200 / this._speed);
            // Define the duration of the dash in milliseconds. The
            // dash is supposed to be 3x that of the dot.
            this._dashDuration = (this._dotDuration * 3);
            // Define the pause duration. This is the time between
            // letters and is supposed to be 1x that of the dot.
            this._pauseDuration = (this._dotDuration * 1);
            // Define the pattern map for the morse code patterns
            // as the relate the alpha-numeric characters that they
            // represent.
            this._patternMap = {
                "•⁃": "A",
                "⁃•••": "B",
                "⁃•⁃•": "C",
                "⁃••": "D",
                "•": "E",
                "••⁃•": "F",
                "⁃⁃•": "G",
                "••••": "H",
                "••": "I",
                "•⁃⁃⁃": "J",
                "⁃•⁃": "K",
                "•⁃••": "L",
                "⁃⁃": "M",
                "⁃•": "N",
                "⁃⁃⁃": "O",
                "•⁃⁃•": "P",
                "⁃⁃•⁃": "Q",
                "•⁃•": "R",
                "•••": "S",
                "⁃": "T",
                "••⁃": "U",
                "•••⁃": "V",
                "•⁃⁃": "W",
                "⁃••⁃": "X",
                "⁃•⁃⁃": "Y",
                "⁃⁃••": "Z",
                "⁃⁃⁃⁃⁃": "0",
                "•⁃⁃⁃⁃": "1",
                "••⁃⁃⁃": "2",
                "•••⁃⁃": "3",
                "••••⁃": "4",
                "•••••": "5",
                "⁃••••": "6",
                "⁃⁃•••": "7",
                "⁃⁃⁃••": "8",
                "⁃⁃⁃⁃•": "9",
                "•⁃•⁃•⁃": ".",
                "⁃⁃••⁃⁃": ",",
                "••⁃⁃••": "?",
                "•⁃⁃•⁃•": "@",
                "⁃••⁃•": "/",
                "⁃⁃⁃•••": ":",
                "•⁃⁃⁃⁃•": "'",
                "⁃••••⁃": "-",
                "⁃•••⁃": "=",
                "⁃•⁃⁃•": "(",
                "⁃•⁃⁃•⁃": ")",
                "•⁃••⁃•": '"',
                "•⁃•⁃•": "+",
                "⁃••⁃": "×",		// Multiplication
                "••••••••": "[err]",	// Error

            };
            // I am the current, transient sequence being evaluated.
            this._sequence = "";
            // ---------------------------------------------- //
            // ---------------------------------------------- //
            // I add the given value to the current sequence.
            //
            // Throws InvalidTone if not a dot or dash.
            this.addSequence = function( value ){
                // Check to make sure the value is valid.
                if (
                    (value !== "•") &&
                    (value !== "⁃")
                    ){
                    // Invalid value.
                    throw( new Error( "InvalidTone" ) );
                }
                // Add the given value to the end of the current
                // sequence value.
                this._sequence += value;
                // Return this object reference.
                return( this );
            };
            // I add a dash to the current sequence.
            this.dash = function(){
                // Reroute to the addSequence();
                return( this.addSequence( "⁃" ) );
            };
            // I add a dot to the current sequence.
            this.dot = function(){
                // Reroute to the addSequence();
                return( this.addSequence( "•" ) );
            };
            // I get the alpha-numeric character set as an array of
            // sequence-character pairs.
            this.getAlphabet = function(){
                // Create the empty set.
                var characterSet = [];
                // Loop over the patterns to map them to a character
                // set item.
                for (var pattern in this._patternMap){
                    // Push it onto the set.
                    characterSet.push({
                        sequence: pattern,
                        character: this._patternMap[ pattern ]
                    });
                }
                // Sort the character set alphabetically.
                characterSet.sort(
                    function( a, b ){
                        return( a.character <= b.character ? -1 : 1 );
                    }
                );
                // Return the character set.
                return( characterSet );
            };
            // I get the dash duration.
            this.getDashDuration = function(){
                return( this._dashDuration );
            };
            // I get the dot duration.
            this.getDotDuration = function(){
                return( this._dotDuration );
            };
            // I get the pause duration.
            this.getPauseDuration = function(){
                return( this._pauseDuration );
            };
            // I reset the current sequence.
            this.resetSequence = function(){
                // Clear the sequence.
                this._sequence = "";
            };
            // I get the possible character matches based on the
            // current sequence.
            this.resolvePartial = function(){
                // Create an array to hold our possible characters.
                var potentialCharacters = [];
                // Loop over the pattern match to find partial matches.
                for (var pattern in this._patternMap){
                    // Check to see if the current sequence can be
                    // the start of the given pattern.
                    if (pattern.indexOf( this._sequence ) === 0){
                        // Add this character to the list.
                        potentialCharacters.push(
                            this._patternMap[ pattern ]
                        );
                    }
                }
                // Return the potential character matches.
                return( potentialCharacters.sort() );
            };
            // I get the alpha-numeric charater repsented by the
            // current sequence. I also also reset the internal
            // sequence value.
            //
            // Throws InvalidSequence if it cannot be mapped to a
            // valid alpha-numeric character.
            this.resolveSequence = function(){
                // Check to see if the current sequence is valid.
                if (!this._patternMap.hasOwnProperty( this._sequence )){
                    // The sequence cannot be matched.
                    throw( new Error( "InvalidSequence" ) );
                }
                // Get the alpha-numeric mapping.
                var character = this._patternMap[ this._sequence ];
                // Reset the sequence.
                this._sequence = "";
                // Return the mapped character.
                return( character );
            };
            // ---------------------------------------------- //
            // ---------------------------------------------- //
            // Return this object reference.
            return( this );
        }).call( {} );
