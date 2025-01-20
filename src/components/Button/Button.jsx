import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import styles from './Button.module.css';
import { memo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addNode } from '../Features/portsSlice';

const Button = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [orientation, setOrientation] = useState(null);
    const [inputValue, setInputValue] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
    const dispatch = useDispatch();

    const toggleDropdown = useCallback(() => {
        setIsOpen(prevIsOpen => !prevIsOpen);
        setOrientation(null); 
    }, []);

    const handleOrientationSelect = useCallback((selectedOrientation) => {
        setOrientation(selectedOrientation);
    }, []);

    const handleInputChange = useCallback((direction) => (e) => {
        const value = Math.max(0, Math.min(2, Number(e.target.value)));
        setInputValue(prevValues => ({ ...prevValues, [direction]: value }));
    }, []);

    const handleSubmit = useCallback(() => {
        const randomX = Math.random() * 500;
        const randomY = Math.random() * 500;

        const newNode = { ports: inputValue, position: { x: randomX, y: randomY }};
        dispatch(addNode(newNode));
        setInputValue({ left: 0, right: 0, top: 0, bottom: 0 });
        setIsOpen(false);
        setOrientation(null);
    }, [inputValue, dispatch]);

    const getRelevantDirections = () => {
        return orientation === 'vertical' ?['top', 'bottom']: ['left', 'right']  ;
    };

    return (
        <div>
            <button className={styles.button} onClick={toggleDropdown} type="button">
                <AddIcon />
            </button>
            {isOpen && (
                <div className={styles.dropdown}>
                    {!orientation ? (
                        <div className={styles.orientationButtons}>
                            <button 
                                className={styles.buttonRect}
                                onClick={() => handleOrientationSelect('vertical')}
                            >
                                Vertical
                            </button>
                            <button 
                                className={styles.buttonRect}
                                onClick={() => handleOrientationSelect('horizontal')}
                            >
                                Horizontal
                            </button>
                        </div>
                    ) : (
                        <>
                            {getRelevantDirections().map((direction) => (
                                <React.Fragment key={direction}>
                                    <label className={styles.label}>
                                        Number of inputs on {direction[0].toUpperCase() + direction.slice(1)}
                                    </label>
                                    <input
                                        className={styles.input}
                                        type="number"
                                        value={inputValue[direction]}
                                        onChange={handleInputChange(direction)}
                                        aria-label={`Number of inputs on ${direction}`}
                                        
                                    />
                                </React.Fragment>
                            ))}
                            <button className={styles.buttonRect} onClick={handleSubmit} type="button">
                                Add node
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

export default Button;