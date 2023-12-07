import { useMemo, useState } from "react";
import styles from "./Itens.module.css";
import Item from "./Item";
import Pagination from "../Pagination";




export default function Itens({ busca, filtro, dados }) {

    const [currentPage, setCurrentPage] = useState(1);
    
    function testaBusca(title) {
        if (busca === '') return true;
        const regex = new RegExp(busca, 'i');
        return regex.test(title);
    }

    function testaFiltro(id) {
        if (filtro !== null) return filtro === id;
        return true;
    }

    const listaFiltrada = useMemo(() => {
        return dados.filter((item) => testaBusca(item.nome) && testaFiltro(item.status));
    })

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return listaFiltrada.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, listaFiltrada]);

    return (
        <div className={styles.itens}>
            {currentTableData.map((item) => (
                <Item
                    key={item.id}
                    title={item.nome}
                    total={item.total}
                    status={item.status}
                    respondentes={item.respondentes}
                    dataEdicao={item.dataEdicao}
                    dataAbertura={item.dataAbertura}
                    dataEncerramento={item.dataEncerramento}
                />
            ))}
            <div className={styles.paginacao}>
                <Pagination
                    currentPage={currentPage}
                    totalCount={dados.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
            </div>
        </div>
    )
}

const PageSize = 4;