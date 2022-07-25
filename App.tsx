import React, {useEffect} from 'react';
import {Easing, StyleSheet, View} from 'react-native';

import {
  Canvas,
  Path,
  runTiming,
  Skia,
  Text,
  useComputedValue,
  useFont,
  useValue,
} from '@shopify/react-native-skia';
import * as d3 from 'd3';

const GRAPH_MARGIN = 20;
const GRAPH_BAR_WIDTH = 8;

const SVGHeight = 300;
const SVGWidth = 300;
const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
const graphWidth = SVGWidth - 2;

const data = [
  {label: 'Jan', value: 500},
  {label: 'Feb', value: 312},
  {label: 'Mar', value: 424},
  {label: 'Apr', value: 745},
  {label: 'May', value: 89},
  {label: 'Jun', value: 434},
  {label: 'Jul', value: 650},
  {label: 'Aug', value: 980},
  {label: 'Sep', value: 123},
  {label: 'Oct', value: 186},
  {label: 'Nov', value: 689},
  {label: 'Dec', value: 643},
];

const App = () => {
  const chartCompleted = useValue(0);

  const font = useFont(require('./Roboto-Bold.ttf'), 10);

  const animateChart = () => {
    chartCompleted.current = 0;

    runTiming(chartCompleted, SVGHeight, {
      duration: 1600,
      easing: Easing.inOut(Easing.exp),
    });
  };

  useEffect(() => {
    animateChart();
  }, []);

  const xDomain = data.map(item => item.label);
  const xRange = [0, graphWidth];
  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

  const yDomain = [0, d3.max(data, d => d.value)];
  const yRange = [0, graphHeight];
  const y = d3.scaleLinear().domain(yDomain).range(yRange);

  const myPath = useComputedValue(() => {
    const path = Skia.Path.Make();
    data.map(item => {
      const rect = Skia.XYWHRect(
        x(item.label) - GRAPH_BAR_WIDTH / 2,
        y(item.value) + SVGHeight - chartCompleted.current,
        GRAPH_BAR_WIDTH,
        SVGHeight,
      );
      path.addRect(rect);
    });
    return path;
  }, [chartCompleted]);

  if (!font) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Path path={myPath} color="purple" />
        {data.map(item => (
          <Text
            font={font}
            x={x(item.label) - 10}
            y={SVGHeight}
            text={item.label}
          />
        ))}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  canvas: {
    width: SVGWidth,
    height: SVGHeight,
  },
});

export default App;
