"use client";

import React, { useRef } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { List, AutoSizer } from "react-virtualized";
import "../components/table.css";

interface Order {
  id: string;
  customerName: string;
  orderAmount: number;
  status: string;
  createdAt: string;
}

const fetchOrders = async ({ pageParam = "" }: { pageParam?: string }) => {
  const response = await axios.get("http://localhost:3001/api/orders", {
    params: {
      cursor: pageParam,
      limit: 50,
      sort: "createdAt",
      sortDirection: "desc",
    },
  });
  return response.data;
};

const VirtualTable = () => {
  const listRef = useRef<any>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery("orders", fetchOrders, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error loading data.</div>;

  const orders = data?.pages.flatMap((page) => page.data) || [];

  const rowRenderer = ({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
  }) => {
    const order = orders[index];
    if (!order)
      return (
        <div key={key} style={style}>
          Loading...
        </div>
      );

    return (
      <div key={key} style={style} className="row">
        <span>{order.customerName}</span>
        <span>{order.orderAmount.toFixed(2)}</span>
        <span>{order.status}</span>
        <span>{new Date(order.createdAt).toLocaleString()}</span>
      </div>
    );
  };

  const onScroll = ({
    scrollHeight,
    scrollTop,
    clientHeight,
  }: {
    scrollHeight: number;
    scrollTop: number;
    clientHeight: number;
  }) => {
    if (
      scrollHeight - scrollTop <= clientHeight * 2 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <span>Customer Name</span>
        <span>Order Amount</span>
        <span>Status</span>
        <span>Created At</span>
      </div>
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height - 50} // Adjust height to exclude header
            rowCount={orders.length}
            rowHeight={50}
            rowRenderer={rowRenderer}
            width={width}
            onScroll={onScroll}
          />
        )}
      </AutoSizer>
      {isFetchingNextPage && (
        <div className="loading-more">Loading more...</div>
      )}
    </div>
  );
};

export default VirtualTable;
