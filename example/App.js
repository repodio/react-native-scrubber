import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Scrubber from './Scrubber/';
import TestDrag from './TestDrag';

const TOTAL_DURATION_1 = 30000
const TOTAL_DURATION_2 = 10000
const TOTAL_DURATION_3 = 5000
const TOTAL_DURATION_4 = 1000
const TOTAL_DURATION_5 = 500

export default class App extends React.Component {
  state = {
    scrubberValue1: 0,
    scrubberValue2: 0,
    scrubberValue3: 0,
    scrubberValue4: 0,
    scrubberValue5: 0,
  }

  componentDidMount() {
    this.valueChangeInterval = setInterval(() => {
      const { 
        scrubberValue1,
        scrubberValue2,
        scrubberValue3,
        scrubberValue4,
        scrubberValue5,
      } = this.state;

      this.setState({ 
        scrubberValue1: scrubberValue1 + 1,
        scrubberValue2: scrubberValue2 + 1,
        scrubberValue3: scrubberValue3 + 1,
        scrubberValue4: scrubberValue4 + 1,
        scrubberValue5: scrubberValue5 + 1,
      })
    }, 200);
  }

  componentWillUnmount() {
    clearInterval(this.valueChangeInterval);
  }

  valueChange1 = value => {
    this.setState({ scrubberValue1: value })
  }

  valueChange2 = value => {
    this.setState({ scrubberValue2: value })
  }
  
  valueChange3 = value => {
    this.setState({ scrubberValue3: value })
  }
  
  valueChange4 = value => {
    this.setState({ scrubberValue4: value })
  }
  
  valueChange5 = value => {
    this.setState({ scrubberValue5: value })
  }

  render() {
    return (
      <View style={styles.root}>
        {/* <TestDrag /> */}
        <Scrubber 
          value={this.state.scrubberValue1}
          onValueChange={this.valueChange1}
          totalDuration={TOTAL_DURATION_1}
          trackColor='#8d309b'
          scrubbedColor='#666'
        />
        <Scrubber 
          value={this.state.scrubberValue2}
          onValueChange={this.valueChange2}
          totalDuration={TOTAL_DURATION_2}
          trackColor='#1098F7'
          scrubbedColor='#666'
        />
        <Scrubber 
          value={this.state.scrubberValue3}
          onValueChange={this.valueChange3}
          totalDuration={TOTAL_DURATION_3}
          trackColor='#F0C808'
          scrubbedColor='#666'
        />
        <Scrubber 
          value={this.state.scrubberValue4}
          onValueChange={this.valueChange4}
          totalDuration={TOTAL_DURATION_4}
          trackColor='#FF4242'
          scrubbedColor='#666'
        />
        <Scrubber 
          value={this.state.scrubberValue5}
          onValueChange={this.valueChange5}
          totalDuration={TOTAL_DURATION_5}
          trackColor='#3DDC97'
          scrubbedColor='#666'
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
    justifyContent: 'space-around',
    padding: 20,
  },
});
