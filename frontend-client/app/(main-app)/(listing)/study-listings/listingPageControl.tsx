import { Pagination } from 'react-bootstrap'

type ListingPageControlProps = {
  page: number,
  setPage: (page: number) => void
}

function PagePrev({page, setPage} : ListingPageControlProps) {
  return (
    page <= 1
      ? <Pagination.Prev disabled onClick={(event) => setPage(page - 1)}/>
      : <Pagination.Prev onClick={(event) => setPage(page - 1)}/>
  )
}

function PageNext({page, setPage} : ListingPageControlProps) {
  return (
    page == 0
      ? <Pagination.Next disabled onClick={(event) => setPage(page + 1)}/>
      : <Pagination.Next onClick={(event) => setPage(page + 1)}/>
  )
}

export default function ListingPageControl({page, setPage} : ListingPageControlProps) {
  return (
    <Pagination className="custom-pagination">
      <PagePrev page={page} setPage={setPage} />
      <Pagination.Item>{page}</Pagination.Item>
      <PageNext page={page} setPage={setPage} />
    </Pagination>
  )
}