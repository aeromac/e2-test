import * as React from 'react';
import { IDataTableProps } from './IDataTableProps';
import { DataGrid, DataGridBody, DataGridCell, DataGridRow, TableCellLayout, TableColumnDefinition, createTableColumn, Image, TableRowData } from '@fluentui/react-components';
import { ITFLData } from '../data/ITFLData';

export class DataTable extends React.Component<IDataTableProps, {}> {

  columns: TableColumnDefinition<ITFLData>[] = [
    createTableColumn<ITFLData>({
      columnId: "asset",
      compare: (a, b) => {
        return a.commonName.localeCompare(b.commonName);
      },
      renderHeaderCell: () => {
        return "Asset";
      },
      renderCell: (item) => {
        return <TableCellLayout media={<Image src={this.props.dataType.icon} />}>
          {item.commonName}
        </TableCellLayout>
      },
    })];

  public render(): React.ReactElement<IDataTableProps> {
    const { data } = this.props;

    return <div style={{ height: '200px', overflowY: 'scroll' }}>
      <DataGrid
        items={data}
        columns={this.columns}
        subtleSelection={true}
        selectionAppearance='none'
        selectionMode='single'
        onSelectionChange={this.onSelectionChange.bind(this)}
        getRowId={(item) => item}
      >
        <DataGridBody<ITFLData>>
        {({ item, rowId }: TableRowData<ITFLData>) => (
            <DataGridRow<ITFLData>
              key={rowId}
            >
              {({ renderCell }: TableColumnDefinition<ITFLData>) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  }

  private onSelectionChange(e: Object, data: any) {
    const { onSelectionChange } = this.props;
    const item:ITFLData = data.selectedItems.values().next().value;
    onSelectionChange?.call(this, e, item);
  }
}
