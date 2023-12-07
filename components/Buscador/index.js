import styles from './Buscador.module.css';
import { CgSearch } from 'react-icons/cg';

export default function Buscador({ busca, setBusca, content }) {
    return (
      <div className={styles.buscador}>
        <CgSearch size={30} color="#4C4D5E" />
        <input value={busca} placeholder={content}  onChange={(evento) => setBusca(evento.target.value)} />
      </div>
    );
  }