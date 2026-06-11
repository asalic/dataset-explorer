import { Link } from "react-router-dom";
import { Badge, Table as BTable } from 'react-bootstrap';
import { ArrowDownUp, CaretDownFill, CaretUpFill } from "react-bootstrap-icons";
import { useTable, useRowSelect, useFilters, useGlobalFilter, useSortBy, Row, Column, CellProps } from 'react-table';
import { Fragment, useMemo } from 'react';
import {matchSorter} from 'match-sorter';

import DataManager from "../../api/DataManager";
import TableNoData from "../common/TableNoData";
import UrlFactory from "../../service/UrlFactory";
import type UserListItem from "../../model/user/UserListItem";
import type MainTableSortBy from "../../model/MainTableSortBy";


interface DefaultColumnFilterColumn {
  filterValue: string;
  preFilteredRows: Row[];
  setFilter: Function;
}

interface DefaultColumnFilterProps {
  column: DefaultColumnFilterColumn;
}


function DefaultColumnFilter({column: { filterValue, preFilteredRows, setFilter },}: DefaultColumnFilterProps): JSX.Element {
  const count = preFilteredRows.length
  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function fuzzyTextFilterFn(rows: ReadonlyArray<Row>, id: string, filterValue: string): Array<Row> {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: string) => !val;


interface MoreLinkProps {
  row: Row<UserListItem>;
}

function MoreLink({row}: MoreLinkProps): JSX.Element {
  return  (
    <div>
      <Link className="btn btn-link" 
        to={UrlFactory.userDetails(row.original["username"])}>More</Link>
    </div>
  );
}


interface ColNameIdRenderProps {
  row: Row<UserListItem>
}

function ColNameIdRender({row}: ColNameIdRenderProps): JSX.Element {
  return (
    <Fragment>
      {row.original["name"]} <br />
      (<i>{row.original["uid"]}</i>)
    </Fragment>
  );
}

interface ColFlagsRenderProps {
  row: Row<UserListItem>
}

function ColFlagsRender({row}: ColFlagsRenderProps): JSX.Element {
  return (
      <div className="mt-1 mb-1">
        {( row.original["disabled"] ? <Badge pill bg="secondary">Invalidated</Badge> : <Fragment /> )}
        {( row.original["emailVerified"] ? <Badge pill bg="dark">EmailVerified</Badge> : <Fragment /> )}
      </div>
  );
}

interface ColCreatedRenderProps {
  row: Row<UserListItem>
}

function ColCreatedRender({row}: ColCreatedRenderProps): JSX.Element {
  var dateTimeParts = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
                            .format(Date.parse(row.original["creationDate"])).split(',');
  return (
    <Fragment>
    {dateTimeParts[0]}
    <br />
    {dateTimeParts[1]}
    </Fragment>
  );
}

interface TableProps {
  columns: Array<Column<any>>;
  data: Array<UserListItem>;
  updSearchParams: Function;
  sortBy: MainTableSortBy[];
}

function Table({ columns, data, sortBy, updSearchParams}: TableProps) {
  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow,
    //selectedFlatRows,
     // getTableBodyProps,
     // state,
      //state: { selectedRowIds, globalFilter },
      visibleColumns,
      //setSortBy
     // preGlobalFilteredRows,
     // setGlobalFilter 
    } = useTable<any>({
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      //filterTypes,
      manualSortBy: true,
      initialState: {
          sortBy
      }
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        ...columns,
        {
          id: 'operations',
          disableSortBy: true,
          Cell: ({row}: CellProps<any>) => <MoreLink row={row}/>
        }
      ])
    }
  );

  // Render the UI for your table
  return (
    <BTable striped bordered hover size="sm" {...getTableProps()} >
      <thead>
        {headerGroups.map(headerGroup => {
            const { key, ...hProps } = headerGroup.getHeaderGroupProps();
            return (
                <tr {...hProps} key="Header">
                  {headerGroup.headers.map((column: any) =>  {
                      const { key, ...restProps } = column.getHeaderProps(column.getSortByToggleProps());
                      return (
                            <th 
                                key={`tr-${Math.random().toString(16).slice(2)}`}
                                {...restProps}
                                onClick={() => 
                                  {
                                    column.toggleSortBy(!column.isSortedDesc);
                                    updSearchParams({sortBy: column.id, sortDirection: column.isSortedDesc ? "ascending" : "descending"});
                                  }}
                            >
                              {column.render('Header')}
                              <span>
                                  { column.canSort ? (column.isSorted
                                    ? (column.isSortedDesc
                                      ? <CaretDownFill className="text-primary"/>
                                      :  <CaretUpFill className="text-primary"/>)
                                    : <ArrowDownUp className="ms-1 text-primary" size="0.75em"/> ) 
                                  : ""}
                              </span>
                            </th>
                          )
                    }
                  )}
                </tr>
              )
          }
        )}
        <tr>
          <th colSpan={visibleColumns.length} style={{ textAlign: 'left', }} ></th>
        </tr>
      </thead>
      <tbody>
        {
          ( 
            rows.length > 0 && rows.map(row => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr {...restRowProps} key={`tr-${Math.random().toString(16).slice(2)}`} >
                {row.cells.map(cell => {
                  return (
                    <td  {...cell.getCellProps()} key={`td-${Math.random().toString(16).slice(2)}`}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
              )
            })
          ) || <TableNoData colSpan={columns.length} message="No users found"></TableNoData>
        }
      </tbody>
    </BTable>
  )
}

interface UsersMainTableProps {
  data: UserListItem[],
  dataManager: DataManager,
  postMessage: Function;
  updSearchParams: Function;
  currentSort: MainTableSortBy;
}

function UsersMainTable(props: UsersMainTableProps): JSX.Element {
  const sortBy: MainTableSortBy[] = useMemo(() => {return [props.currentSort]}, [props.currentSort]);
  const columns = useMemo(() => [
    {
      Header: () => <Fragment>Name (<i>ID</i>)</Fragment>,
      id: "name",
      accessor: 'name',
      Cell: ({row}: CellProps<any>) => <ColNameIdRender  row={row}/>
    },
    {
      Header: 'Flags',
      id: "flags",
      Cell: ({row}: CellProps<any>) => <ColFlagsRender   row={row}/> 
    },
    {
      Header: 'Username',
      id: "username",
      accessor: 'username'
    },
    {
      Header: 'Email',
      id: "email",
      accessor: 'email'
    },
    {
      Header: 'Gid',
      id: "gid",
      accessor: 'gid'
    },
    // {
    //   Header: 'Project',
    //   id: "project",
    //   accessor: 'project'
    // },
    {
      Header: 'Created',
      id: "creationDate",
      accessor: 'creationDate',
      Cell: ({ row }: CellProps<any>) => <ColCreatedRender  row={row}/> 
    }
  ], [props]);
    return <Table columns={columns} 
      sortBy={sortBy} data={props.data} updSearchParams={props.updSearchParams} />
}

export default UsersMainTable;
