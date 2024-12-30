import AddIcon from '@mui/icons-material/Add';
import styles from './Button.module.css';


const Button = ({onClick}) => {
    
    
  return (
    <div > 
            <button
                onClick={onClick}
                className={styles.button}
            >
                <AddIcon  />
            </button>
        </div>
  )
}

export default Button