import React, {useCallback, useEffect} from 'react';
import {Button, Easing, StyleSheet, View} from 'react-native';

import {
  Canvas,
  Group,
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

const SVGHeight = 350;
const SVGWidth = 350;
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

  const animateChart = useCallback(() => {
    chartCompleted.current = 0;

    runTiming(chartCompleted, 1, {
      duration: 1600,
      easing: Easing.inOut(Easing.exp),
    });
  }, [chartCompleted]);

  useEffect(() => {
    animateChart();
  }, [animateChart]);

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

        <Group>
          {data.map(item => (
            <Text
              key={item.label}
              font={font}
              x={x(item.label) - 10}
              y={SVGHeight - 25}
              text={item.label}
            />
          ))}
        </Group>
      </Canvas>
      <Button
        title="Reanimate"
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
    width: SVGWidth,
    height: SVGHeight,
  },
});

export default App;
