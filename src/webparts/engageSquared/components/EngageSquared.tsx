import * as React from 'react';
import { IEngageSquaredProps } from './IEngageSquaredProps';
import { ThemeProvider, PartialTheme, Spinner, Dropdown, IDropdownOption } from '@fluentui/react';
import { SPHttpClient } from '@microsoft/sp-http-base';
import BingMapsReact from "bingmaps-react";
import { IEngageSquaredState } from './IEngageSquaredState';
import { ITFLData } from '../data/ITFLData';
import { DataTypeOption } from './DataTypeOption';
import { DataTable } from './DataTable';

export default class EngageSquared extends React.Component<IEngageSquaredProps, {}> {
  appTheme: PartialTheme = {
    palette: {
      themePrimary: '#165af1',
      themeLighterAlt: '#f5f8fe',
      themeLighter: '#d8e4fd',
      themeLight: '#b7ccfb',
      themeTertiary: '#709bf7',
      themeSecondary: '#316ef4',
      themeDarkAlt: '#1452da',
      themeDark: '#1146b8',
      themeDarker: '#0c3388'
    }
  };

  dataTypes: DataTypeOption[] = [
    {
      key: 'CarPark',
      text: 'Car parks',
      selected: true,
      icon: require('../assets/parking.png')
    },
    {
      key: 'SpeedCam',
      text: 'Speed cameras',
      icon: require('../assets/speed-camera.png')
    },
    {
      key: 'TaxiRank',
      text: 'Taxi ranks',
      icon: require('../assets/taxi.png')
    },
    {
      key: 'BikePoint',
      text: 'Bike points',
      icon: require('../assets/bicycle.png')
    }
  ];

  state: IEngageSquaredState = {
    isLoading: true,
    dataType: this.dataTypes[0],
    pins: [],
    data: [],
    center: [51.5286416, -0.1015987],
    zoom: 10
  }

  public componentDidMount() {
  }

  public render(): React.ReactElement<IEngageSquaredProps> {
    const { bingMapsApiKey } = this.props;
    const { isLoading, dataType, pins, data, center, zoom } = this.state;

    return <ThemeProvider theme={this.appTheme}>
      <section>
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          {isLoading ?
            <Spinner label='Loading map...' /> :
            <Dropdown
              selectedKey={dataType.key}
              placeholder='Select a data type'
              onChange={this.onDataTypeChange.bind(this)}
              options={this.dataTypes} />}

          <BingMapsReact bingMapsKey={bingMapsApiKey}
            height="500px"
            width="100%"
            mapOptions={{
              navigationBarMode: "square",
            }}
            viewOptions={{
              center: { latitude: center[0], longitude: center[1] }, zoom
            }}
            onMapReady={isLoading && this.onMapReady.bind(this)}
            pushPins={pins} />

            <DataTable
            dataType={dataType}
            data={data}
            onSelectionChange={this.onSelectionChange.bind(this)} />
        </div>
      </section>
    </ThemeProvider>
  }

  private onMapReady(e: Object) {
    const { dataType } = this.state;
    this.setState({ isLoading: false });
    this.getData(dataType);
  }

  private onDataTypeChange(e: React.FormEvent, option: IDropdownOption) {
    this.setState({ isLoading: true, dataType: option }, () => this.getData(this.state.dataType));
  }

  private getData(dataType: DataTypeOption) {
    const { context, tflApiPath } = this.props;
    const { httpClient } = context;

    httpClient.get(tflApiPath + dataType.key, SPHttpClient.configurations.v1)
      .then((response) => response.json())
      .then((json) => this.parseData(json))
      .catch((e) => {
        console.log(e);
      });
  }

  private parseData(json: Object) {
    const { dataType } = this.state;

    const data = json as ITFLData[];
    const pins: any[] = [];

    data.forEach(i => {
      pins.push({
        center: {
          latitude: i.lat,
          longitude: i.lon,
        },
        options: {
          title: i.commonName,
          icon: dataType.icon
        },
      });
    });

    this.setState({ data, pins, isLoading: false });
  }

  private onSelectionChange(e: Object, item: ITFLData) {
    this.setState({ center: [item.lat, item.lon], zoom: 16 });
  }
}
