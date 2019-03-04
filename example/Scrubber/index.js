import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'

formatValue = value => {
  const hours = Math.floor(value / 3600);
  const rawMinutes = (value / 60) - (60 * hours)
  const minutes = Math.floor(rawMinutes)
  const seconds = Math.floor((rawMinutes - minutes) * 60)
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMinutes = minutes < 10 && hours ? `0${minutes}` : minutes;

  if(hours) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }
  return `${formattedMinutes}:${formattedSeconds}`
}

export default class extends Component {

  static propTypes = {
  }

  formattedStartingNumber = () => {
    const { value } = this.props;
    return formatValue(value)
  }

  formattedEndingNumber = () => {
    const { value, totalDuration } = this.props;
    return `-${formatValue(totalDuration - value)}`
  }

  render() {
    const {
      value,
      onValueChange,
      totalDuration,
    } = this.props;

    return <View style={styles.root}><Text>{this.formattedStartingNumber()} --- {this.formattedEndingNumber()}</Text></View>
  }
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 50,
    backgroundColor: 'red'
  },
});
