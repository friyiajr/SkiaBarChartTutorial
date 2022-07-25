import React, {useCallback} from 'react';
import {Button, Easing, StyleSheet, View} from 'react-native';

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

const CanvasHeight = 350;
const CanvasWidth = 350;
const graphHeight = CanvasHeight - 2 * GRAPH_MARGIN;
const graphWidth = CanvasWidth - 2;

const data = [
  {label: 'Jan', value: 50},
  {label: 'Feb', value: 100},
  {label: 'Mar', value: 350},
  {label: 'Apr', value: 200},
  {label: 'May', value: 550},
  {label: 'Jun', value: 300},
  {label: 'Jul', value: 150},
  {label: 'Aug', value: 400},
  {label: 'Sep', value: 450},
  {label: 'Oct', value: 500},
  {label: 'Nov', value: 250},
  {label: 'Dec', value: 600},
];

const App = () => {
  const chartCompleted = useValue(0);

  const font = useFont(require('./Roboto-Bold.ttf'), 10);

  const animateChart = useCallback(() => {
    chartCompleted.current = 0;

    runTiming(chartCompleted, 1, {
      duration: 1250,
      easing: Easing.inOut(Easing.exp),
    });
  }, [chartCompleted]);

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
        graphHeight,
        GRAPH_BAR_WIDTH,
        y(item.value * chartCompleted.current) * -1,
      );
      const roundedRect = Skia.RRectXY(rect, 8, 8);
      path.addRRect(roundedRect);
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
            key={item.label}
            font={font}
            x={x(item.label) - 10}
            y={CanvasHeight - 25}
            text={item.label}
          />
        ))}
      </Canvas>
      <Button
        title="Animate !"
        onPress={() => {
          animateChart();
        }}
      />
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
    width: CanvasWidth,
    height: CanvasHeight,
  },
});

export default App;
