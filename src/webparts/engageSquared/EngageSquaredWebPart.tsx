import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import EngageSquared from './components/EngageSquared';
import { IEngageSquaredProps } from './components/IEngageSquaredProps';
import * as strings from 'EngageSquaredWebPartStrings';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';

import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

export interface IEngageSquaredWebPartProps {
  bingMapsApiKey: string;
  tflApiPath: string;
}

export default class EngageSquaredWebPart extends BaseClientSideWebPart<IEngageSquaredWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IEngageSquaredProps> = React.createElement(
      EngageSquared,
      {
        context: this.context,
        bingMapsApiKey: this.properties.bingMapsApiKey,
        tflApiPath: this.properties.tflApiPath
      }
    );

    ReactDom.render(
      <FluentProvider theme={teamsLightTheme}>
        {element}
      </FluentProvider>, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.MapOptionsName,
              groupFields: [
                PropertyPaneTextField('bingMapsApiKey', {
                  label: strings.BingMapAPIKeyLabel
                }),
                PropertyPaneTextField('tflApiPath', {
                  label: strings.TFLAPIPathLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
