import { useQuery } from "react-query";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

import { fetchData } from "./fetchData";
import { useState } from "react";

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    enableColumnFilter: false,
  },
  { accessorKey: "product", header: "Name" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "brand", header: "Brand" },
];

const offset = 0;
const limit = 10000;

export const App = () => {
  const [filters, setFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });

  const { data, isPending, error, isError, isLoading, isFetching } = useQuery({
    queryKey: ["IDs", filters],
    queryFn: async () => {
      const filterParams = filters.reduce((accumulator, { id, value }) => {

        accumulator[id] = id === 'price'?Number(value):value.trim();

        return accumulator;
      }, {});

      const ids = await fetchData({
        action: filters.length ? "filter" : "get_ids",
        params: filters.length ? filterParams : { offset, limit },
      });

      const response = await fetchData({
        action: "get_items",
        params: { ids: ids, offset, limit },
      });

      return response;
    },
  });

  const table = useMantineReactTable({
    columns,
    pagination,
    onPaginationChange: setPagination,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableSorting: false,
    enableGlobalFilter: false,
    onColumnFiltersChange: setFilters,
    data: data ?? [],
    state: {
      isLoading: isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      showColumnFilters: true,
      pagination,
      columnFilters: filters,
    },
    initialState: { density: "xs" },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return <MantineReactTable table={table} />;
};
