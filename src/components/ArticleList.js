import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api';
import { getArticle, addArticle, saveArticle, deleteArticle } from '../reducer/Calls';

const articleSelector = state => state.article.articleList
const articleCountSelector = state => state.article.count

export default function ArticleList(){
    const [isDialogShown, setIsDialogShown] = useState(false)
    const [isDialogReferencesShown, setIsDialogReferencesShown] = useState(false)

    const [title, setTitle] = useState('')
    const [abstract, setAbstract] = useState('')
    const [date, setDate] = useState('')

    const [isNewRecord, setIsNewRecord] = useState(true)
    const [selectedArticle, setSelectedArticle] = useState(null)
    const [filterString, setFilterString] = useState('')

    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState(1)

    const [filters, setFilters] = useState({
        articleId: { value: null, matchMode: FilterMatchMode.CONTAINS },
        articleTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
        articleAbstract: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })
    const [page, setPage] = useState(0)
    const [first, setFirst] = useState(0)
    

    const handleFilter = (evt) => {
        const oldFilters = filters
        oldFilters[evt.field] = evt.constraints.constraints[0]
        setFilters({ ...oldFilters })
      }
    
    const handleFilterClear = (evt) => {
        setFilters({
            title: { value: null, matchMode: FilterMatchMode.CONTAINS },
            abstract: { value: null, matchMode: FilterMatchMode.CONTAINS }
        })
    }

    useEffect(() => {
        const keys = Object.keys(filters)
        const computedFilterString = keys.map(e => {
            return {
            key: e,
            value: filters[e].value
            }
    }).filter(e => e.value).map(e => `${e.key}=${e.value}`).join('&')
        setFilterString(computedFilterString)
    }, [filters])

    const articles = useSelector(articleSelector)
    const count = useSelector(articleCountSelector)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getArticle(filterString, page, 2, sortField, sortOrder))
    }, [filterString, page, sortField, sortOrder])

    const handleAddClick = (evt) => {
        setIsDialogShown(true)
        setIsNewRecord(true)
        setTitle('')
        setAbstract('')
    }

    const hideDialog = () => {
        setIsDialogShown(false)
    }

    const hideReferencesDialog = () => {
        setIsDialogReferencesShown(false);
    }

    const handleReferences = (evt) => {
        setIsDialogReferencesShown(true)
    }

    const handleSaveClick = () => {
        if (isNewRecord) {
            dispatch(addArticle({ "articleTitle": title, "articleAbstract": abstract, "articleDate": date }))
        } else {
            dispatch(saveArticle(selectedArticle, { "articleTitle": title, "articleAbstract": abstract, "articleDate": date }))
        }
        setIsDialogShown(false)
        setSelectedArticle(null)
        setTitle('')
        setAbstract('')
        setDate('')
    }

    const editArticle = (rowData) => {
        setSelectedArticle(rowData.articleId)
        setTitle(rowData.articleTitle)
        setAbstract(rowData.articleAbstract)
        setIsDialogShown(true)
        setIsNewRecord(false)
    }

    const handleDeleteArticle = (rowData) => {
        dispatch(deleteArticle(rowData.articleId))
    }

    const tableFooter = (
        <div>
            <Button icon='pi pi-plus' onClick={handleAddClick} />
        </div>
    )

    const dialogFooter = (
        <div>
            <Button label='.' icon='pi pi-save' onClick={handleSaveClick} />
        </div>
    )

    const opsColumn = (rowData) => {
        return (
            <>
                <Button label='Edit' icon='pi pi-pencil' onClick={() => editArticle(rowData)} />
                <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteArticle(rowData)} />
                <Button label='References' icon='pi pi-info' className='p-button p-button-info' onClick={() => handleReferences(rowData)} />
            </>
        )
    }

    const handlePageChange = (evt) => {
        setPage(evt.page)
        setFirst(evt.page * 2)
    }

    const handleSort = (evt) => {
        console.warn(evt)
        setSortField(evt.sortField)
        setSortOrder(evt.sortOrder)
        console.log(articles);
    }

    const handleExport = () => {
        let json = JSON.stringify(articles);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(json);
        let exportFileDefaultName = 'data.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    const handleImport = () => {
        const defaultData = require('./data.json');
        //const arrDefault = JSON.parse(defaultData);
        console.log(defaultData);

        for (let i of defaultData) {
            console.log(i);
            dispatch(addArticle({ "articleTitle": i.articleTitle, "articleAbstract": i.articleAbstract, "articleDate": i.articleDate }))
        }
    }

    return (
        <div>
            <button className='btn btn-dark' onClick={handleExport}>Export data</button>
            <button className='btn btn-dark' onClick={handleImport}>Import data</button>

            <DataTable
                value={articles}
                footer={tableFooter}
                lazy
                paginator
                onPage={handlePageChange}
                first={first}
                rows={2}
                totalRecords={count}
                onSort={handleSort}
                sortField={sortField}
                sortOrder={sortOrder}
            >
                <Column header='Title' field='articleTitle' filter filterField='articleTitle' filterPlaceholder='filter by title' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
                <Column header='Abstract' field='articleAbstract' filter filterField='articleAbstract' filterPlaceholder='filter by abstract' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
                <Column header='Date' field='articleDate' sortable />
                <Column body={opsColumn} />
            </DataTable>
            <Dialog header='Add Article' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
                <div>
                <InputText placeholder='title' onChange={(evt) => setTitle(evt.target.value)} value={title} />
                </div>
                <div>
                <InputText placeholder='abstract' onChange={(evt) => setAbstract(evt.target.value)} value={abstract} />
                </div>
                <div>
                <InputText placeholder='date' onChange={(evt) => setDate(evt.target.value)} value={date} />
                </div>
            </Dialog>

            <Dialog header='References for article' visible={isDialogReferencesShown} onHide={hideReferencesDialog} footer={dialogFooter}>
                <div>
                {/* <Text value={title} /> */}
                </div>
                <div>
                    {date}
                </div>
                <div>
                {/* <InputText placeholder='authors' onChange={(evt) => setAuthors(evt.target.value)} value={authors} /> */}
                </div>
            </Dialog>

        </div>
    )
}