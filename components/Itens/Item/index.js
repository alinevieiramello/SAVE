import Link from 'next/link'
import styles from "./Item.module.css";
import { HiUserGroup } from "react-icons/hi";
import { AiOutlineHistory } from "react-icons/ai";
import { LuCalendarClock } from "react-icons/lu";
import { useEffect } from 'react';
import statusFilters from '../../../lib/statusFilters.json';



export default function Item({ title, total, respondentes, dataEdicao, dataAbertura, dataEncerramento, status }) {

    const initial = new Date(dataEdicao);
    const hoje = new Date();
    const dif = hoje - initial;
    const diasAtras = Math.floor(dif / (1000 * 60 * 60 * 24));
    const dA = new Date(dataAbertura);
    const dAFormatted = dA.toLocaleDateString('pt-BR');
    const dE = new Date(dataEncerramento);
    const dEFormatted = dE.toLocaleDateString('pt-BR');


    useEffect(() => {},[respondentes]);

    return (
        <div className={styles.item}>
            <div className={styles.imagem} >
                <Link href={`/survey/${'1'}`}>
                    <div />
                </Link>
            </div>
            <div className={styles.descricao}>
                <div className={styles.titulo}>
                    <h2><Link href={`/survey/${'1'}`}><a>{title}</a></Link></h2>
                </div>
                <div className={styles.tags}>
                    {status === statusFilters[0].id && (
                        <div className={styles.dataAbertura}>
                            <AiOutlineHistory size={18} /> {`${diasAtras} dias atrás`}
                        </div>

                    )}
                    {status === statusFilters[1].id && (
                        <div className={styles.dataAbertura}>
                            <LuCalendarClock size={18} /> {`${dAFormatted} - ${dEFormatted}`}
                        </div>
                    )}
                    <div className={styles.total}>
                        <HiUserGroup size={18} /> {`${respondentes}/${total}`}
                    </div>
                </div>
            </div>
            <div className={status === statusFilters[0].id ? styles.dotbutton : styles.button}>
                {status ===  statusFilters[0].id ? (
                    <a>...</a>
                ) :
                    (
                        <div className={styles.progressbutton}>
                            <div className={styles.progress}>
                                <a>{`${(respondentes/total)*100}% concluíram`}</a>
                                <progress className={styles.progressbar} value={respondentes} max={total} />
                            </div>
                            <Link href={`/survey/${'1'}`}>
                                <button>Ver</button>
                            </Link>
                        </div>
                    )}
            </div>
        </div>
    )
}