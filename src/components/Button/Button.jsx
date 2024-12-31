import React, { useState, useEffect, useRef } from 'react';
import styles from './Button.module.css';

const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const Buttons = ({ showDelete, onClickAdd, onClickDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [numberInputs, setNumberInputs] = useState(0);
    const [numberOutputs, setNumberOutputs] = useState(0);
    const dropdownRef = useRef(null);

    useClickOutside(dropdownRef, () => {
        if (isOpen) {
            setIsOpen(false);
            setNumberInputs(0);
            setNumberOutputs(0);
        }
    });

    const handleOnClickAdd = (event) => {
        event.stopPropagation();
        setIsOpen(true);
    };

    const handleOnClickAddNode = (event) => {
        event.stopPropagation();

        if (numberInputs > 4 || numberInputs < 0 || numberOutputs > 4 || numberOutputs < 0) return;

        setIsOpen(false);
        onClickAdd(numberInputs, numberOutputs);
        setNumberInputs(0);
        setNumberOutputs(0);
    };

    const handleChangeNumberInputs = (event) => {
        setNumberInputs(parseInt(event.target.value, 10));
    };

    const handleChangeNumberOutputs = (event) => {
        setNumberOutputs(parseInt(event.target.value, 10));
    };

    return (
        <div className={styles.wrapper}>
            <button className={showDelete ? styles.buttonDelete : styles.buttonDeleteHidden} onClick={onClickDelete}>
                <svg
                    fill="currentColor"
                    strokeWidth="0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    height="1em"
                    width="1em"
                    style={{ overflow: 'visible' }}
                >
                    {/* SVG path for delete icon */}
                </svg>
            </button>
            <button className={styles.buttonAdd} onClick={handleOnClickAdd}>
                <svg
                    fill="currentColor"
                    strokeWidth="0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    height="1em"
                    width="1em"
                    style={{ overflow: 'visible' }}
                >
                    {/* SVG path for add icon */}
                </svg>
            </button>

            {isOpen && (
                <div ref={dropdownRef} className={styles.dropdown}>
                    <label className={styles.label}>Number of inputs</label>
                    <input className={styles.input} type="number" value={numberInputs} onChange={handleChangeNumberInputs} />
                    <label className={styles.label}>Number of outputs</label>
                    <input className={styles.input} type="number" value={numberOutputs} onChange={handleChangeNumberOutputs} />
                    <button className={styles.buttonRect} onClick={handleOnClickAddNode}>
                        Add node
                    </button>
                </div>
            )}
        </div>
    );
};

export default Buttons;
