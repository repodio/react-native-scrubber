import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Scrubber from './Scrubber/';
import TestDrag from './TestDrag';

const TOTAL_DURATION = 30000

export default class App extends React.Component {
  state = {
    scrubberValue: 0,
  }

  componentDidMount() {
    this.valueChangeInterval = setInterval(() => {
      const { scrubberValue } = this.state;
      if(scrubberValue >= TOTAL_DURATION) {
        clearInterval(this.valueChangeInterval)
      } else {
        this.setState({ scrubberValue: scrubberValue + 1 })
      }
    }, 200);
  }

  componentWillUnmount() {
    clearInterval(this.valueChangeInterval);
  }

  valueChange = value => {
    this.setState({ scrubberValue: value })
  }

  render() {
    return (
      <View style={styles.root}>
        {/* <TestDrag /> */}
        <Scrubber 
          value={this.state.scrubberValue}
          onValueChange={this.valueChange}
          totalDuration={TOTAL_DURATION}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
