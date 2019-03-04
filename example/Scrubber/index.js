import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'

const DefaultColors = {
  valueColor: '#999',
  trackBackgroundColor: '#DDD',
  trackColor: '#666',
  scrubbedColor: 'red',
}


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
  state = {
    scrubbing: false,
    scrubbingValue: 0,
  };

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

  onValueChange = () => {
    this.props.onValueChange(this.state.scrubbingValue);
  }

  render() {
    const {
      value,
      totalDuration,
    } = this.props;

    const {
      scrubbing,
      scrubbingValue,
    } = this.state;

    const displayedValue = scrubbing ? scrubbingValue : value
    const progressPercent = (displayedValue / totalDuration) * 100;

    return (
      <View style={styles.root}>
        <View style={styles.trackContainer} >
          <View style={styles.backgroundTrack} />
          <View style={[styles.progressTrack, { width: `${progressPercent}%` }]} />
          <TouchableWithoutFeedback >
            <View style={[styles.trackSlider, { left: `${progressPercent}%` }]}  />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.valuesContainer} >
          <Text style={styles.value}>{this.formattedStartingNumber()}</Text>
          <Text style={styles.value}>{this.formattedEndingNumber()}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  valuesContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    color: DefaultColors.valueColor,
  },
  trackContainer: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundTrack: {
    position: 'absolute',
    height: 3,
    width: '100%',
    borderRadius: 3,
    backgroundColor: DefaultColors.trackBackgroundColor,
  },
  progressTrack: {
    position: 'absolute',
    height: 3,
    width: 0,
    left: 0,
    borderRadius: 3,
    backgroundColor: DefaultColors.trackColor,
    zIndex: 1,
  },
  trackSlider: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: DefaultColors.trackColor,
    zIndex: 2,
    left: 50,
    position: 'absolute',
  }
});
