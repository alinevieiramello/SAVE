import Link from 'next/link';
import styles from './Navbar.module.css';
import { signOut, useSession } from 'next-auth/react';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';


const Rotas = [
    {
        nome: 'Home',
        path: '/',
        admin: false
    },
    {
        nome: 'Quem somos',
        path: '/quem-somos',
        admin: false
    },
    {
        nome: 'Ver pesquisas',
        path: '/pesquisas',
        admin: false
    },
    {
        nome: 'Gerenciar Questionários',
        path: '/survey/manage',
        admin: true
    },
    {
        nome: 'Visualização de dados',
        path: '/relatorio',
        admin: true
    },
    {
        nome: 'Dados públicos',
        path: '/dados-publicos',
        admin: true
    },
    {
        nome: 'Gerenciar Participantes',
        path: '/participantes',
        admin: true
    }
]

const RotasUser = [
    {
        nome: 'Login',
        path: '/login'
    },
    {
        nome: 'Cadastre-se',
        path: '/cadastrar'
    }
]

const Navbar = () => {
    const { data: session } = useSession();



    return (
        <nav className={styles.nav}>
            <h1 className={styles.logo}>SAVE</h1>
            <div className={styles.divideritems}>
                <ul className={styles.items}>
                    {session && session.user.role === 'admin' ? Rotas.filter((item) => item.admin).map(rota => (
                        <li className={styles.item} key={rota.path}>
                            <Link href={rota.path}>
                                <a className={styles.label}>{rota.nome}</a>
                            </Link>
                        </li>
                    ))
                        :
                        Rotas.filter((item) => !item.admin).map(rota => (
                            <li className={styles.item} key={rota.path}>
                                <Link href={rota.path}>
                                    <a className={styles.label}>{rota.nome}</a>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className={styles.posregister}>
                <ul className={styles.registeritems}>
                    {session ?
                        <>
                            <li className={styles.registeritem}>
                                <button className={styles.notificacao}><FaBell fontSize={27} /></button>
                            </li>
                            <li className={styles.registeritem}>
                                <button className={styles.sair} onClick={() => signOut()}><FaSignOutAlt fontSize={27} /></button>
                            </li>
                        </>
                        : RotasUser.map(rota => (
                            <li className={styles.registeritem} key={rota.path}>
                                <Link href={rota.path}>
                                    <button className={rota.nome == 'Login' ? styles.login : styles.register}><a className={rota.nome == 'Login' ? styles.blacklabel : null}>{rota.nome}</a></button>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;