import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
} from '@mui/material';

// Define Props Type
interface DynamicTableProps<T> {
  data: T[];
  columns: (keyof T)[];
  enableSorting: boolean;
  enablePagination: boolean;
  enableFilter: boolean;
  rowsPerPageOptions: number[];
  initialRowsPerPage: number;
  style: React.CSSProperties;
}

// interface Column<T> {
//   id: keyof T;
//   label: string;
//   render?: (value: T[keyof T], row: T) => React.ReactNode;
// }

type Order = 'asc' | 'desc';

function DynamicTable<T extends object>({
  data,
  columns,
  enableSorting = false,
  enablePagination = false,
  enableFilter = false,
  rowsPerPageOptions = [5, 10, 25],
  initialRowsPerPage = 5,
  style = {},
}: DynamicTableProps<T>) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [filter, setFilter] = useState('');

  const handleSortRequest = (column: keyof T) => {
    if (!enableSorting) return;
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column as keyof T);
  };

  // 페이지 변경 핸들러
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 페이지당 행 수 변경 핸들러
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 정렬된 데이터 계산
  const sortedData = useMemo(() => {
    if (!enableSorting || !orderBy) return data;
    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return order === 'asc'
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });
  }, [data, enableSorting, order, orderBy]);

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    if (!enableFilter) return sortedData;
    return sortedData.filter(row =>
      columns.some(column =>
        String(row[column]).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [sortedData, enableFilter, filter, columns]);

  // 표시할 데이터 계산 (페이지네이션 적용)
  const displayedData = useMemo(() => {
    if (!enablePagination) return filteredData;
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, enablePagination, page, rowsPerPage]);

  return (
    <Paper
      sx={{
        ...style,
        overflow: 'auto',
      }}
    >
      {enableFilter && (
        <TextField
          variant="outlined"
          label="Search"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          fullWidth
        />
      )}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={String(column)}>
                  {enableSorting ? (
                    <TableSortLabel
                      active={orderBy === column}
                      direction={orderBy === column ? order : 'asc'}
                      onClick={() => handleSortRequest(column)}
                    >
                      {String(column).toUpperCase()}
                    </TableSortLabel>
                  ) : (
                    String(column).toUpperCase()
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map(row => (
              <TableRow hover>
                {columns.map(column => (
                  <TableCell key={String(column)}>
                    {String(row[column])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {displayedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {enablePagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}

export default DynamicTable;
