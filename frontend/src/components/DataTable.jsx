import { useState } from "react";
import "../styles/dataTable.css";

export default function DataTable({ data, columns }) {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });

    // Sort function for the table
    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                onClick={() => requestSort(column.key)}
                                className={
                                    sortConfig.key === column.key
                                        ? `sorted-${sortConfig.direction}`
                                        : ""
                                }
                            >
                                {column.label}
                                {sortConfig.key === column.key && (
                                    <span className="sort-indicator">
                                        {sortConfig.direction === "ascending" ? " ▲" : " ▼"}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column) => (
                                <td key={`${rowIndex}-${column.key}`}>{row[column.key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
