/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';

import {
  columns,
  metrics,
} from 'src/explore/components/DatasourcePanel/fixtures';
import { fireEvent, render, within } from 'spec/helpers/testing-library';
import DatasourcePanelItem from './DatasourcePanelItem';

const mockData = {
  metricSlice: metrics,
  columnSlice: columns,
  totalMetrics: Math.max(metrics.length, 10),
  totalColumns: Math.max(columns.length, 13),
  width: 300,
  showAllMetrics: false,
  setShowAllMetrics: jest.fn(),
  showAllColumns: false,
  setShowAllColumns: jest.fn(),
  collapseMetrics: false,
  setCollapseMetrics: jest.fn(),
  collapseColumns: false,
  setCollapseColumns: jest.fn(),
};

test('renders each item accordingly', () => {
  const { getByText, getByTestId, rerender, container } = render(
    <DatasourcePanelItem index={0} data={mockData} style={{}} />,
    { useDnd: true },
  );

  expect(getByText('Metrics')).toBeInTheDocument();
  rerender(<DatasourcePanelItem index={1} data={mockData} style={{}} />);
  expect(
    getByText(
      `Showing ${mockData.metricSlice.length} of ${mockData.totalMetrics}`,
    ),
  ).toBeInTheDocument();
  mockData.metricSlice.forEach((metric, metricIndex) => {
    rerender(
      <DatasourcePanelItem
        index={metricIndex + 2}
        data={mockData}
        style={{}}
      />,
    );
    expect(getByTestId('DatasourcePanelDragOption')).toBeInTheDocument();
    expect(
      within(getByTestId('DatasourcePanelDragOption')).getByText(
        metric.metric_name,
      ),
    ).toBeInTheDocument();
  });
  rerender(
    <DatasourcePanelItem
      index={2 + mockData.metricSlice.length}
      data={mockData}
      style={{}}
    />,
  );
  expect(container).toHaveTextContent('');

  const startIndexOfColumnSection = mockData.metricSlice.length + 3;
  rerender(
    <DatasourcePanelItem
      index={startIndexOfColumnSection}
      data={mockData}
      style={{}}
    />,
  );
  expect(getByText('Columns')).toBeInTheDocument();
  rerender(
    <DatasourcePanelItem
      index={startIndexOfColumnSection + 1}
      data={mockData}
      style={{}}
    />,
  );
  expect(
    getByText(
      `Showing ${mockData.columnSlice.length} of ${mockData.totalColumns}`,
    ),
  ).toBeInTheDocument();
  mockData.columnSlice.forEach((column, columnIndex) => {
    rerender(
      <DatasourcePanelItem
        index={startIndexOfColumnSection + columnIndex + 2}
        data={mockData}
        style={{}}
      />,
    );
    expect(getByTestId('DatasourcePanelDragOption')).toBeInTheDocument();
    expect(
      within(getByTestId('DatasourcePanelDragOption')).getByText(
        column.column_name,
      ),
    ).toBeInTheDocument();
  });
});

test('can collapse metrics and columns', () => {
  mockData.setCollapseMetrics.mockClear();
  mockData.setCollapseColumns.mockClear();
  const { queryByText, getByRole, rerender } = render(
    <DatasourcePanelItem index={0} data={mockData} style={{}} />,
    { useDnd: true },
  );
  fireEvent.click(getByRole('button'));
  expect(mockData.setCollapseMetrics).toBeCalled();
  expect(mockData.setCollapseColumns).not.toBeCalled();

  const startIndexOfColumnSection = mockData.metricSlice.length + 3;
  rerender(
    <DatasourcePanelItem
      index={startIndexOfColumnSection}
      data={mockData}
      style={{}}
    />,
  );
  fireEvent.click(getByRole('button'));
  expect(mockData.setCollapseColumns).toBeCalled();

  rerender(
    <DatasourcePanelItem
      index={1}
      data={{
        ...mockData,
        collapseMetrics: true,
      }}
      style={{}}
    />,
  );
  expect(
    queryByText(
      `Showing ${mockData.metricSlice.length} of ${mockData.totalMetrics}`,
    ),
  ).not.toBeInTheDocument();

  rerender(
    <DatasourcePanelItem
      index={2}
      data={{
        ...mockData,
        collapseMetrics: true,
      }}
      style={{}}
    />,
  );
  expect(queryByText('Columns')).toBeInTheDocument();
});
