import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Scrubber from './Scrubber/';



export default class App extends React.Component {
  state = {
    scrubberValue: 5700,
  }

  componentDidMount() {
    this.adjustValue = setInterval(() => {
      const { scrubberValue } = this.state;
      this.setState({ scrubberValue: scrubberValue + 1 })
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.adjustValue);
  }

  valueChange = value => {
    this.setState({ scrubberValue: value })
  }

  render() {
    return (
      <View style={styles.root}>
        <Scrubber 
          value={this.state.scrubberValue}
          onValueChange={this.valueChange}
          totalDuration={7300}
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
    padding: 30,
  },
});
