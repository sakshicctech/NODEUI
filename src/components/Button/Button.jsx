import AddIcon from '@mui/icons-material/Add';
import styles from './Button.module.css';
import { memo, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addNode } from '../Features/portsSlice';

const Button = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
    const dispatch = useDispatch();


    
    const handleOnClick = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (direction) => (e) => {
        setInputValue({ ...inputValue, [direction]: Number(e.target.value) });
    };

    const handleSubmit = () => {
        const newNode = { ports: inputValue };
        dispatch(addNode(newNode)); 
        setInputValue({ left: 0, right: 0, top: 0, bottom: 0 });
        setIsOpen(false);
    };

    return (
        <div>
            <button className={styles.button} onClick={handleOnClick}>
                <AddIcon />
            </button>
            {isOpen && (
                <div className={styles.dropdown} >
                    <label className={styles.label}>Number of inputs on Left</label>
                    <input
                        className={styles.input}
                        type="number"
                        value={inputValue.left}
                        onChange={handleInputChange('left')}
                    />
                    <label className={styles.label}>Number of inputs on Right</label>
                    <input
                        className={styles.input}
                        type="number"
                        value={inputValue.right}
                        onChange={handleInputChange('right')}
                    />
                    <label className={styles.label}>Number of inputs on Top</label>
                    <input
                        className={styles.input}
                        type="number"
                        value={inputValue.top}
                        onChange={handleInputChange('top')}
                    />
                    <label className={styles.label}>Number of inputs on Bottom</label>
                    <input
                        className={styles.input}
                        type="number"
                        value={inputValue.bottom}
                        onChange={handleInputChange('bottom')}
                    />
                    <button className={styles.buttonRect} onClick={handleSubmit}>
                        Add node
                    </button>
                </div>
            )}
        </div>
    );
});

export default Button;
