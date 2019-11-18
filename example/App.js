import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Scrubber from 'react-native-scrubber'

class Example extends Component {
state = {
    scrubberValue: 0,
  }

  componentDidMount() {
    this.valueChangeInterval = setInterval(() => {
      this.setState({ 
        scrubberValue: this.state.scrubberValue + 1,
      })
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
        <Scrubber 
          value={this.state.scrubberValue}
          onSlidingComplete={this.valueChange}
          totalDuration={7000}
          trackColor='#666'
          scrubbedColor='#8d309b'
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  root: {
    marginVertical: 30,
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
});

export default Example