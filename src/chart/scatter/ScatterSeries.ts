/*
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

import createListFromArray from '../helper/createListFromArray';
import SeriesModel from '../../model/Series';
import {
    SeriesOption,
    SeriesOnCartesianOptionMixin,
    SeriesOnPolarOptionMixin,
    SeriesOnCalendarOptionMixin,
    SeriesOnGeoOptionMixin,
    SeriesOnSingleOptionMixin,
    OptionDataValue,
    ItemStyleOption,
    LabelOption,
    SeriesLargeOptionMixin,
    SeriesStackOptionMixin,
    SymbolOptionMixin
} from '../../util/types';
import GlobalModel from '../../model/Global';
import List from '../../data/List';
import { BrushCommonSelectorsForSeries } from '../../component/brush/selector';

type ScatterDataValue = OptionDataValue | OptionDataValue[]

export interface ScatterDataItemOption extends SymbolOptionMixin {
    name?: string

    value?: ScatterDataValue

    itemStyle?: ItemStyleOption
    label?: LabelOption

    emphasis?: {
        itemStyle?: ItemStyleOption
        label?: LabelOption
    }
}

export interface ScatterSeriesOption extends SeriesOption,
    SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin,
    SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin,
    SeriesLargeOptionMixin, SeriesStackOptionMixin,
    SymbolOptionMixin {
    type?: 'scatter'

    coordinateSystem?: string

    hoverAnimation?: boolean

    cursor?: string
    clip?: boolean

    itemStyle?: ItemStyleOption
    label?: LabelOption

    emphasis?: {
        itemStyle?: ItemStyleOption
        label?: LabelOption
    }

    data?: (ScatterDataItemOption | OptionDataValue)[]
        | ArrayLike<number> // Can be a flattern array
}


class ScatterSeriesModel extends SeriesModel<ScatterSeriesOption> {
    static readonly type = 'series.scatter'
    type = ScatterSeriesModel.type

    static readonly dependencies = ['grid', 'polar', 'geo', 'singleAxis', 'calendar']

    getInitialData(option: ScatterSeriesOption, ecModel: GlobalModel): List {
        return createListFromArray(this.getSource(), this, {
            useEncodeDefaulter: true
        });
    }


    getProgressive() {
        var progressive = this.option.progressive;
        if (progressive == null) {
            // PENDING
            return this.option.large ? 5e3 : this.get('progressive');
        }
        return progressive;
    }

    getProgressiveThreshold() {
        var progressiveThreshold = this.option.progressiveThreshold;
        if (progressiveThreshold == null) {
            // PENDING
            return this.option.large ? 1e4 : this.get('progressiveThreshold');
        }
        return progressiveThreshold;
    }

    brushSelector(dataIndex: number, data: List, selectors: BrushCommonSelectorsForSeries): boolean {
        return selectors.point(data.getItemLayout(dataIndex));
    }

    static defaultOption: ScatterSeriesOption = {
        coordinateSystem: 'cartesian2d',
        zlevel: 0,
        z: 2,
        legendHoverLink: true,

        hoverAnimation: true,
        symbolSize: 10,          // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
        // symbolRotate: null,  // 图形旋转控制

        large: false,
        // Available when large is true
        largeThreshold: 2000,
        // cursor: null,

        itemStyle: {
            opacity: 0.8
            // color: 各异
        },

        // If clip the overflow graphics
        // Works on cartesian / polar series
        clip: true

        // progressive: null
    }

}

SeriesModel.registerClass(ScatterSeriesModel);

export default ScatterSeriesModel;