import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FormInstance, TablePaginationConfig } from 'antd';
import { Table, TableProps } from 'antd';
import DynamicForm from '@/components/DynamicForm';

interface QueryTableProps<RecordType> extends TableProps<RecordType> {
  fields: Field[];
  initData?: any[];
  fetchData: (params: any) => Promise<any>;
}

const QueryTable = <RecordType extends object>(
  { fields, fetchData, initData = [], ...tableProps }: QueryTableProps<RecordType>
) => {
  const formInstance = useRef<FormInstance<any>>(null);

  // 表格数据
  const [dataSource, setDataSource] = useState(initData);
  // 加载
  const [loading, setLoading] = useState<boolean>(false);

  // 页码或 pageSize 改变的回调，参数是改变后的页码及每页条数
  const handlePaginationChange = (current: number, pageSize: number) => {
    // 不显示分页器
    if (!pagination) return;
    const prevCurrent = pagination.current;
    const prevPageSize = pagination.pageSize;
    setPagination((prevPagination) => ({ ...prevPagination, current, pageSize }));
    try {
      handleSearch();
    } catch (error) {
      setPagination((prevPagination) => ({ ...prevPagination, current: prevCurrent, pageSize: prevPageSize }));
    }
  };

  // 分页
  const [pagination, setPagination] = useState<TablePaginationConfig | false>(
    tableProps.pagination !== false &&
    (tableProps.pagination ? { ...tableProps.pagination, onChange: handlePaginationChange } : {})
  );

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      const formData = formInstance.current?.getFieldsValue();
      const params = pagination ? {
        formData,
        pageInfo: {
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
      } : { formData };
      const { data, pageInfo } = await fetchData(params);
      setPagination((prevPagination) => ({ ...prevPagination, ...pageInfo }));
      setDataSource(data);
    } catch (error) {
      Promise.reject(error);
    } finally {
      setLoading(false);
    }
  }, [fetchData, pagination]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div>
      <DynamicForm fields={fields} ref={formInstance} onFinish={() => handleSearch()} />
      <Table {...tableProps} dataSource={dataSource} pagination={pagination} loading={loading} />
    </div>
  );
};

export default QueryTable;
