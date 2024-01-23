/**
 * Functional component that renders a sortable and searchable table.
 *
 * @template T Type of data to display in the table.
 * @param {TableProps<T>} props The properties passed to the component.
 * @param {readonly { title: string; field: keyof T }[]} props.columns Column configuration for the table.
 * @param {T[]} props.data Array of data objects to display in the table.
 */
import React, { useState } from 'react';
import styles from './tableComponent.module.css';

type TableProps<T> = {
  columns: readonly { title: string; field: keyof T }[];
  data: T[];
};

export const TableComponent = <T extends Record<string, unknown>>({
  columns,
  data,
}: TableProps<T>) => {
  // State hooks for pagination, sorting, and searching
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortedColumn, setSortedColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  /**
   * Resets the current page to the first page.
   */
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  /**
   * Handles the search input change event and resets to the first page.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e The event object.
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    resetToFirstPage();
  };

  /**
   * Sorts the data based on the sorted column and direction.
   *
   * @param {T[]} data The data array to sort.
   * @returns {T[]} The sorted data array.
   */
  const sortData = (data: T[]): T[] => {
    if (!sortedColumn) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortedColumn];
      const valueB = b[sortedColumn];

      if (valueA instanceof Date && valueB instanceof Date) {
        return sortDirection === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      const strValueA = String(valueA);
      const strValueB = String(valueB);

      if (strValueA < strValueB) return sortDirection === 'asc' ? -1 : 1;
      if (strValueA > strValueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  /**
   * Formats a Date object into a string.
   *
   * @param {Date} date The Date object to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };

  const filteredData = search
    ? data.filter((row) =>
        columns.some((col) => {
          const value = row[col.field];
          const formattedValue = value instanceof Date ? formatDate(value) : String(value);
          return formattedValue.toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  const sortedData = sortData(filteredData);

  const totalEntries = sortedData.length;
  const indexOfFirstEntry = (currentPage - 1) * entriesPerPage;
  let indexOfLastEntry = indexOfFirstEntry + entriesPerPage;
  indexOfLastEntry = indexOfLastEntry > totalEntries ? totalEntries : indexOfLastEntry;
  const currentEntries = sortedData.slice(indexOfFirstEntry, indexOfLastEntry);
  const lastPage = Math.ceil(totalEntries / entriesPerPage);

  /**
   * Handles the page change.
   *
   * @param {number} pageNumber The new page number.
   */
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= lastPage) {
      setCurrentPage(pageNumber);
    }
  };

  /**
   * Handles the sorting of the table when a column header is clicked.
   *
   * @param {keyof T} field The field key to sort by.
   */
  const handleSort = (field: keyof T) => {
    if (sortedColumn === field) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortedColumn(field);
      setSortDirection('asc');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: keyof T) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleSort(field);
    }
  };

  return (
    <div>
      <div className={styles.tableControlsWrapper}>
        <div className={styles.entriesControl}>
          <p>
            Show
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            entries
          </p>
        </div>
        <div className={styles.tableSearchControl}>
          <p>Search : </p>
          <input type='text' placeholder='Search...' value={search} onChange={handleSearch} />
        </div>
      </div>
      <table className={styles.table} aria-labelledby='tableTitle' role='grid'>
        <caption id='tableTitle' className={styles.visuallyHidden}>
          Table of Data
        </caption>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                className={styles.th}
                key={index}
                tabIndex={0}
                onClick={() => handleSort(col.field)}
                onKeyDown={(e) => handleKeyDown(e, col.field)}
                scope='col'
                aria-sort={
                  sortedColumn === col.field
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                {col.title}
                {sortedColumn === col.field && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((row, index) => (
            <tr className={styles.tr} key={index}>
              {columns.map((col) => (
                <td className={styles.td} key={String(col.field)}>
                  {row[col.field] instanceof Date
                    ? formatDate(row[col.field] as Date)
                    : String(row[col.field])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.tableFooterControls}>
        <div className={styles.paginationInfo}>
          Showing {indexOfFirstEntry + 1} to {indexOfLastEntry} of {totalEntries} entries
        </div>
        <div className={styles.paginationButtons}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <input
            type='number'
            value={currentPage}
            onChange={(e) => goToPage(Math.max(1, Math.min(lastPage, Number(e.target.value))))}
            min={1}
            max={lastPage}
          />
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === lastPage}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
