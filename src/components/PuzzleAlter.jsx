import React, { useState, useRef, useEffect } from 'react';
import { FaDeleteLeft } from "react-icons/fa6";

const deleteIcon = <FaDeleteLeft />;

const KEYBOARD_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
];

const WORD_LIST = [
    'REACT', 'REDUX', 'HOOKS', 'STATE', 'PROPS',
    'ASYNC', 'FETCH', 'ARRAY', 'CLICK', 'EVENT'
];

export const PuzzleAlter = () => {
    const [guesses, setGuesses] = useState(Array(6).fill(''));
    const [currentGuess, setCurrentGuess] = useState('');
    const [message, setMessage] = useState('');
    const [currentRow, setCurrentRow] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [keyboardStatus, setKeyboardStatus] = useState({});
    const solutionRef = useRef('');

    useEffect(() => {
        solutionRef.current = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
        console.log(solutionRef.current);
    }, []);

    const updateKeyboardStatus = (guess) => {
        const newStatus = { ...keyboardStatus };
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            if (solutionRef.current[i] === letter) {
                newStatus[letter] = 'correct';
            } else if (solutionRef.current.includes(letter) && newStatus[letter] !== 'correct') {
                newStatus[letter] = 'present';
            } else if (!solutionRef.current.includes(letter)) {
                newStatus[letter] = 'absent';
            }
        }
        setKeyboardStatus(newStatus);
    };

    const handleKeyPress = (key) => {
        if (gameOver || currentRow >= 6) return;

        if (key === 'DELETE') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (key === 'ENTER') {
            if (currentGuess.length === 5) {
                const newGuesses = [...guesses];
                newGuesses[currentRow] = currentGuess;
                setGuesses(newGuesses);
                updateKeyboardStatus(currentGuess);

                if (currentGuess === solutionRef.current) {
                    setMessage('Congratulations! You guessed the word!');
                    setGameOver(true);
                } else if (currentRow === 5) {
                    setMessage(`Game over. The word was ${solutionRef.current}.`);
                    setGameOver(true);
                } else {
                    setCurrentRow(prev => prev + 1);
                    setCurrentGuess('');
                }

            }
        } else if (currentGuess.length < 5 && keyboardStatus[key] !== 'absent') {
            setCurrentGuess(prev => prev + key);
        }
    };

    const getLetterBackgroundColor = (letter, index, rowIndex) => {

        if (rowIndex > currentRow) return '';
        if (!letter) return '';

        if (solutionRef.current[index] === letter) {
            return 'bg-primary text-black';
        } else if (solutionRef.current.includes(letter)) {
            return '';
        }
        return 'text-secondary';
    };

    const getKeyboardKeyClass = (key) => {
        switch (keyboardStatus[key]) {
            case 'correct':
                return 'bg-primary text-black';
            case 'present':
                return '';
            case 'absent':
                return 'text-secondary';
            default:
                return '';
        }
    };

    return (
        <div className="sm:p-4 flex flex-col items-center h-full justify-between">
            <h1 className="text-2xl font-bold mb-4">Guess the word</h1>
            <div className="mb-4">
                {guesses.map((guess, i) => (
                    <div key={i} className="flex mb-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                            <div
                                key={j}
                                className={`w-14 max-ssm:w-11 h-14 max-ssm:h-11 border-style rounded-lg flex items-center justify-center mr-1 ipad:h-20 ipad:w-20 ipad:mr-3 text-2xl font-bold ${getLetterBackgroundColor(guess[j], j, i)}`}
                            >
                                {i === currentRow ? currentGuess[j] || '' : guess[j] || ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="mb-1">
                {KEYBOARD_LAYOUT.map((row, i) => (
                    <div key={i} className="flex justify-center mb-2">
                        {row.map((key) => (
                            <button
                                key={key}
                                onClick={() => handleKeyPress(key)}
                                className={`mx-0.5 sm:mx-1 max-ssm:px-2 px-3 py-2 ipad:px-5 ipad:py-4 ipad:text-base rounded-lg max-sm:text-xs border-style box-glow ${getKeyboardKeyClass(key)}`}
                                disabled={gameOver || keyboardStatus[key] === 'absent'}
                            >
                                {key === 'DELETE' ? deleteIcon : key}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            {message && <p className="sm:text-lg">{message}</p>}
        </div>
    );
};