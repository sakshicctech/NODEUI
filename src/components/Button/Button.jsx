import AddIcon from '@mui/icons-material/Add';
import styles from './Button.module.css';
import { memo } from 'react';

const Button = memo(() => {
  console.log('Rendering Button');
  return (
    <button className={styles.button}>
      <AddIcon/>
    </button>
  );
});

export default Button;
