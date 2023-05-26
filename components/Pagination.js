import { useMemo } from "react"



export const usePagination = ({totalCount, currentPage, pageSize, onPageChange, siblingCount = 1}) => {


    const paginationRange = useMemo(() => {

    }, [totalCount, currentPage, pageSize, onPageChange, siblingCount])
   

    return paginationRange;
}

