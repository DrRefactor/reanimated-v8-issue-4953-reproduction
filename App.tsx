/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const USE_WORKAROUND = false;

if (USE_WORKAROUND) {
  // creates reference to global.queueMicrotask on JS thread, preventing it to be overriden by reanimated threads.ts -> setupMicrotasks
  // see: https://github.com/software-mansion/react-native-reanimated/issues/4953
  // @ts-expect-error
  global.queueMicrotask;
}
// @ts-expect-error
console.log('V8 runtime version', global._v8runtime().version);

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withRepeat(withTiming(1), -1);
  }, [x]);

  useEffect(() => {
    setTimeout(() => {
      // @ts-expect-error
      console.log('global.queueMicrotask=', global.queueMicrotask);
      // [Function anonymous] means it's overriden by reanimated setupMicrotasks
      // [Function queueMicrotask] means it's a deafult native implementation
    }, 5000);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    width: 50,
    height: 50,
    backgroundColor: 'red',
    transform: [
      {
        translateX: x.value * 100,
      },
    ],
  }));

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <Animated.View style={animatedStyle} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
