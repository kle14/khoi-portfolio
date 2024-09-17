import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Prize from './Prize';

const specialChars = [
  "'", "|", "\"", "!", "@", "#", "$", "%", "^", "&", "*",
  "-", "_", "+", "=", ".", ";", ":", "?", ",", "/", "<", ">", "~", "`", "(", ")", "[", "]", "{", "}"
];


const bracketsets = [
  "<>",
  "[]",
  "{}",
  "()",
]

const columnHeight = 16;
const wordColumnWidth = 16;
const maxBracketSets = 7;
const generateRandomSpecialChar = () => {
  return specialChars[Math.floor(Math.random() * specialChars.length)];
};

function generateRandomStringWithSpecialChars(maxLength) {
  let i = 0;
  let result = '';
  while (i < maxLength) {
    result += specialChars[Math.floor(Math.random() * specialChars.length)];
    i++;
  }
  return result;
}



function generateBracketSets(maxBracketSets) {
  let i = 0;
  let arr = [];
  while (i < maxBracketSets) {
    const garbageLength = Math.floor(Math.random() * 5) + 1;
    const bracketSet = bracketsets[Math.floor(Math.random() * bracketsets.length)];
    const garbage = bracketSet[0] + generateRandomStringWithSpecialChars(garbageLength) + bracketSet[1];
    arr.push(garbage);
    i++;
  }
  return arr;
}

const generateRandomHexValue = () => {
  return "0x" + (("0000" + Math.floor(Math.random() * 65536).toString(16).toUpperCase()).substr(-4));
};

const generateGarbageCharacters = () => {
  const rows = [];
  for (let y = 0; y < columnHeight; y++) {
    const row = [];
    for (let x = 0; x < wordColumnWidth; x++) {
      row.push(generateRandomSpecialChar());
    }
    rows.push(row.join(''));
  }
  return rows.join('\n');
};


export const Puzzle = ({ resetKey }) => {
  const [words, setWords] = useState([]);
  const [bracketsets, setBracketsets] = useState([]);
  const [correct, setCorrect] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(4);
  const [column1, setColumn1] = useState([]);
  const [column2, setColumn2] = useState([]);
  const [kv, setKv] = useState({});
  const [hoverContent, setHover] = useState('');
  const [outputContent, setOutputContent] = useState([]);
  const [showPrize, setShowPrize] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [internalResetKey, setInternalResetKey] = useState(0);

  const resetGame = useCallback(() => {
    setWords([]);
    setBracketsets([]);
    setCorrect("");
    setAttemptsRemaining(4);
    setColumn1([]);
    setColumn2([]);
    setKv({});
    setHover('');
    setOutputContent([]);
    setShowPrize(false);
    setIsLocked(false);
    setCountdown(10);
    setInternalResetKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetKey, resetGame]);

  useEffect(() => {
    let timer;
    if (isLocked && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);
    } else if (isLocked && countdown === 0) {
      resetGame();
    }
    return () => clearTimeout(timer);
  }, [isLocked, countdown, resetGame]);


  useEffect(() => {
    const fetchWords = async () => {
      try {
        const wordFileUrl = `${process.env.PUBLIC_URL}/words.txt?v=${new Date().getTime()}`;

        const response = await fetch(wordFileUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const textData = await response.text();

        // Split the text data by spaces and filter out any empty strings
        const allWords = textData.split(' ').filter(word => word.trim() !== '');
        let check = true;
        let shuffledWords;
        let selectedWords;
        do {
          shuffledWords = allWords.sort(() => 0.5 - Math.random());
          selectedWords = shuffledWords.slice(0, 12);

          for (let i = 0; i < selectedWords.length; i++) {
            if (selectedWords[i].length > 16) {
              check = false;
            } else {
              check = true;
            }
          }
        } while (check === false);

        if (selectedWords.length > 0) {
          setWords(selectedWords);

          // Pick a random correct word from the selected words
          const randomNumber = Math.floor(Math.random() * selectedWords.length);
          setCorrect(selectedWords[randomNumber]);
        }
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    setBracketsets(generateBracketSets(maxBracketSets));
    fetchWords();
  }, [internalResetKey]);

  const leftColumn = useMemo(() => Array.from({ length: columnHeight }, generateRandomHexValue), []);
  const rightColumn = useMemo(() => Array.from({ length: columnHeight }, generateRandomHexValue), []);

  useEffect(() => {
    const usedColsFirstHalf = new Set();
    const usedRowsFirstHalf = new Set();
    const usedColsSecondHalf = new Set();
    const usedRowsSecondHalf = new Set();
    const newKv = {};

    const halfLength = Math.ceil(words.length / 2);
    const firstHalfWords = words.slice(0, halfLength);
    const secondHalfWords = words.slice(halfLength);

    const assignWordsToColumns = (words, usedCols, usedRows, where) => {
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word !== undefined) {
          let row;
          do {
            row = Math.floor(Math.random() * columnHeight);
          } while (usedRows.has(row));

          usedRows.add(row);

          let col;
          do {
            col = Math.floor(Math.random() * wordColumnWidth);
          } while (usedCols.has(col));

          if (wordColumnWidth - col < word.length) {
            do {
              col = Math.floor(Math.random() * (wordColumnWidth - word.length));
            } while (usedCols.has(col));
          }

          usedCols.add(col);
          newKv[word] = { row, column: col, location: where };
        }
      }
    };
    assignWordsToColumns(firstHalfWords, usedColsFirstHalf, usedRowsFirstHalf, "col1");
    assignWordsToColumns(secondHalfWords, usedColsSecondHalf, usedRowsSecondHalf, "col2");

    setKv(newKv);

    const newCol1 = generateGarbageCharacters().split('\n').map(row => row.split(''));
    const newCol2 = generateGarbageCharacters().split('\n').map(row => row.split(''));

    const kvEntries = Object.entries(newKv);
    const half = Math.ceil(kvEntries.length / 2);
    const firstHalf = kvEntries.slice(0, half);
    const secondHalf = kvEntries.slice(half);

    // Apply first half to column 1
    for (let [word, { row, column }] of firstHalf) {
      newCol1[row][column] = (
        <span key={`word-${word}`} className="word cursor-pointer box-glow" data-word={word} onClick={() => handleWordClick(word)} onMouseEnter={() => handleMouseEnter(word)}
          onMouseLeave={handleMouseLeave}>
          {word}
        </span>
      );

      for (let s = 1; s < word.length; s++) {
        newCol1[row][column + s] = null;
      }
    }

    // Apply second half to column 2
    for (let [word, { row, column }] of secondHalf) {
      newCol2[row][column] = (
        <span key={`word-${word}`} className="word cursor-pointer box-glow" data-word={word} onClick={() => handleWordClick(word)} onMouseEnter={() => handleMouseEnter(word)}
          onMouseLeave={handleMouseLeave}>
          {word}
        </span>
      );

      for (let s = 1; s < word.length; s++) {
        newCol2[row][column + s] = null;
      }
    }

    //----------------------------------------------
    const allBrackets = bracketsets; // get all the brackets
    const where = ["col1", "col2"]; //where to place the brackets
    const usedRowsFirstHalfBrackets = new Set(); //to keep track of the rows that have brackets
    const usedRowsSecondHalfBrackets = new Set(); //to keep track of the rows that have brackets
    for (let i = 0; i < allBrackets.length; i++) {  //loop through all the brackets
      const brackets = allBrackets[i]; //get the brackets
      let placed = false; //to check if the brackets are placed
      do { //loop until the brackets are placed in the column
        const placement = where[Math.floor(Math.random() * where.length)]; //either col1 or col2
        let row;
        let col;
        if (placement === "col1") { //if the placement is col1
          row = Math.floor(Math.random() * columnHeight); //generate a random row
          if (usedRowsFirstHalfBrackets.has(row)) { //check if the row has brackets
            continue; //if it has brackets, then keep looping
          }

          if (usedRowsFirstHalf.has(row)) { //check if the row has word
            const lengthOfWord = kvEntries.find(([word, { row: r }]) => r === row)[0].length; //get the length of the word

            const startIndexOfWord = kvEntries.find(([word, { row: r }]) => r === row)[1].column; //get the start index of the word

            const endIndexOfWord = startIndexOfWord + lengthOfWord - 1; // start from the next index of the word

            //first generate a column and check if the column is already used by a word
            do {
              col = Math.floor(Math.random() * wordColumnWidth);
            } while (col >= startIndexOfWord && col <= endIndexOfWord);

            //check if where the column is placed has enough space for the brackets
            // for example the start of the index for a word is 5 and the column generated is 3, if the length of the brackets is 5, since 5 - 3 < 5, brackets cannot be placed
            // if the col generated is 14 and the length of the brackets is 5 then brackets cannot be placed because the width of the column is 16, 
            //since 16 - 14 < 5 brackets cannot be placed
            if (startIndexOfWord - col < brackets.length || wordColumnWidth - col < brackets.length || newCol1[row][col] === null) {
              continue;
            }
          } else { //if the row does not have a word
            do {
              col = Math.floor(Math.random() * wordColumnWidth);
            } while (wordColumnWidth - col < brackets.length);

          }
        } else {
          row = Math.floor(Math.random() * columnHeight); //generate a random row
          if (usedRowsSecondHalfBrackets.has(row)) { //check if the row has brackets
            continue;
          }

          if (usedRowsSecondHalf.has(row)) { //check if the row has word
            const lengthOfWord = kvEntries.find(([word, { row: r }]) => r === row)[0].length;

            const startIndexOfWord = kvEntries.find(([word, { row: r }]) => r === row)[1].column;

            const endIndexOfWord = startIndexOfWord + lengthOfWord - 1; // start from the next index of the word


            //first generate a column and check if the column is already used by a word
            do {
              col = Math.floor(Math.random() * wordColumnWidth);
            } while (col >= startIndexOfWord && col <= endIndexOfWord);

            //check if where the column is placed has enough space for the brackets
            if (startIndexOfWord - col < brackets.length || wordColumnWidth - col < brackets.length || newCol2[row][col] === null) {
              continue;
            }

          } else {
            do {
              col = Math.floor(Math.random() * wordColumnWidth);
            } while (wordColumnWidth - col < brackets.length);
          }
        }



        //adding it into the column
        if (placement === "col1") {
          newCol1[row][col] = (
            <span key={`brackets-${i}`} className="brackets cursor-pointer box-glow" data-word={brackets} onClick={(event) => {
              const result = handleBracketsClick(newCol1, newCol2, newKv, brackets, row, col, placement)(event);
              setColumn1(result.newCol1);
              setColumn2(result.newCol2);
            }} onMouseEnter={() => handleMouseEnter(brackets)}
              onMouseLeave={handleMouseLeave}>
              {brackets}
            </span>
          );

          for (let s = 1; s < brackets.length; s++) {
            newCol1[row][col + s] = null
          }

          usedRowsFirstHalfBrackets.add(row);

          placed = true;
        } else {
          newCol2[row][col] = (
            <span key={`brackets-${i}`} className="brackets cursor-pointer box-glow" data-word={brackets} onClick={(event) => {
              const result = handleBracketsClick(newCol1, newCol2, newKv, brackets, row, col, placement)(event);
              setColumn1(result.newCol1);
              setColumn2(result.newCol2);
            }} onMouseEnter={() => handleMouseEnter(brackets)}
              onMouseLeave={handleMouseLeave}>
              {brackets}
            </span>
          );

          for (let s = 1; s < brackets.length; s++) {
            newCol2[row][col + s] = null
          }

          usedRowsSecondHalfBrackets.add(row);

          placed = true;
        }
      } while (!placed);
    }
    setColumn1(newCol1);
    setColumn2(newCol2);

  }, [words]);

  const wordColumns = [column1, column2];

  const handleWordClick = useCallback((word) => {
    if (isLocked) return;

    if (word.toLowerCase() === correct.toLowerCase()) {
      setOutputContent(prev => [...prev, "Entry Granted"]);
      setOutputContent(prev => [...prev, "Please Wait"]);
      setOutputContent(prev => [...prev, "Accessing..."]);

      setTimeout(() => {
        setShowPrize(true);
      }, 3000);
    } else {
      setOutputContent(prev => [...prev, word]);
      setOutputContent(prev => [...prev, 'Entry Denied']);
      let count = 0;
      for (let i = 0; i < word.length; i++) {
        if (correct.includes(word[i])) {
          count++;
        }
      }
      setOutputContent(prev => [...prev, `Likeness=${count}`]);
      setAttemptsRemaining(prevAttempts => {
        const newAttempts = prevAttempts - 1;
        if (newAttempts === 0) {
          setIsLocked(true);
          setOutputContent(prev => [...prev, "System locked"]);
          setCountdown(10);
        }
        return newAttempts;
      });
    }
  }, [correct, isLocked, setOutputContent, setAttemptsRemaining, setShowPrize, setIsLocked, setCountdown]);

  const handleBracketsClick = (col1, col2, kv, brackets, bracketrow, bracketcol, placement) => {
    setOutputContent(prev => [...prev, brackets]);
    setOutputContent(prev => [...prev, 'Dud Removed']);
    return (event) => {
      const tempkv1 = {};
      const tempkv2 = {};
      // Iterate over the kv object using Object.entries()
      for (const [word, details] of Object.entries(kv)) {
        if (details.location === "col1") {
          tempkv1[word] = { ...details };
        }
      }

      for (const [word, details] of Object.entries(kv)) {
        if (details.location === "col2") {
          tempkv2[word] = { ...details };
        }
      }

      const where = ["col1", "col2"];
      const toHide = where[Math.floor(Math.random() * where.length)]

      let pickedWord;
      let word;
      let locateWord = {};
      let newCol1 = [...col1];
      let newCol2 = [...col2];

      if (toHide === "col1") {
        word = Object.keys(tempkv1);
        let count;
        do {
          count = 0;
          do {
            pickedWord = word[Math.floor(Math.random() * word.length)];
          } while (pickedWord === correct)

          locateWord = {
            word: pickedWord,
            row: tempkv1[pickedWord].row,
            column: tempkv1[pickedWord].column
          };

          for (let i = 0; i < pickedWord.length; i++) {
            if (newCol1[locateWord.row][locateWord.column + i] === '.') {
              count++;
            }
          }
        } while (count === pickedWord.length);



        for (let i = 0; i < pickedWord.length; i++) {
          newCol1[locateWord.row][locateWord.column + i] = ".";
        }

      } else {
        word = Object.keys(tempkv2);
        let count;

        do {
          count = 0;
          do {
            pickedWord = word[Math.floor(Math.random() * word.length)];
          } while (pickedWord === correct)
          locateWord = {
            word: pickedWord,
            row: tempkv2[pickedWord].row,
            column: tempkv2[pickedWord].column
          };

          for (let i = 0; i < pickedWord.length; i++) {
            if (newCol2[locateWord.row][locateWord.column + i] === '.') {
              count++;
            }
          }

        } while (count === pickedWord.length);


        for (let i = 0; i < pickedWord.length; i++) {
          newCol2[locateWord.row][locateWord.column + i] = ".";
        }
      }

      if (placement === "col1") {
        for (let i = 0; i < brackets.length; i++) {
          newCol1[bracketrow][bracketcol + i] = brackets[i];
        }
      } else {
        for (let i = 0; i < brackets.length; i++) {
          newCol2[bracketrow][bracketcol + i] = brackets[i];
        }
      }
      return { newCol1, newCol2 };
    }
  }


  const handleMouseEnter = (content) => {
    setHover(content);
  };

  const handleMouseLeave = () => {
    setHover('');
  };

  const handleClickChar = (char) => {
    setOutputContent(prev => [...prev, char]);
  };

  const handleBackToPuzzle = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className='h-full w-full font-mono text-sm'>
      {showPrize ? (
        <Prize onBack={handleBackToPuzzle} />
      ) : (
        <>
          <div className='h-[9%] w-full'>
            Attempts remaining: {attemptsRemaining}
            {isLocked && <span> | Locked. Resetting in {countdown} seconds</span>}
          </div>
          <div className={`w-full flex-1 flex ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className='w-2/5 flex'>
              <div className='w-1/4 mr-4'>
                {leftColumn.map((value, index) => (
                  <p key={index}>{value}</p>
                ))}
              </div>
              <div className='w-3/4'>
                {wordColumns[0].map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="flex">
                    {row.map((char, charIndex) =>
                      char === null ? null :
                        React.isValidElement(char) ? char :
                          <span
                            key={`char-${rowIndex}-${charIndex}`}
                            className="character box-glow"
                            onMouseEnter={() => handleMouseEnter(char)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClickChar(char)}
                          >{char}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className='w-2/5 flex'>
              <div className='w-1/4 mr-4'>
                {rightColumn.map((value, index) => (
                  <p key={index}>{value}</p>
                ))}
              </div>
              <div className='w-3/4'>
                {wordColumns[1].map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="flex">
                    {row.map((char, charIndex) =>
                      char === null ? null :
                        React.isValidElement(char) ? char :
                          <span
                            key={`char-${rowIndex}-${charIndex}`}
                            className="character box-glow"
                            onMouseEnter={() => handleMouseEnter(char)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClickChar(char)}
                          >{char}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className='w-1/5'>
              <div className="output-box overflow-y-scroll flex flex-col-reverse h-full">
                <div>
                  {outputContent.slice().map((content, index) => (
                    <p key={index}>{"> " + content}</p>
                  ))}
                  {<p>{"> " + hoverContent}</p>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const Reset = () => {
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const resetTimer = setInterval(() => {
      setResetKey(prevKey => prevKey + 1);
    }, 10000); // Reset every 10 seconds (matching the countdown)

    return () => clearInterval(resetTimer);
  }, []);

  return <Puzzle key={resetKey} />;
};