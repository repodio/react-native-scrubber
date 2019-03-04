import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  PanResponder,
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
  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        console.log('onPanResponderGrant', { evt, gestureState })
        this.setState({ scrubbing: true, scrubbingValue: this.props.value });
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        console.log('onPanResponderMove', { evt, gestureState })
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        console.log('onPanResponderRelease', { evt, gestureState })
        this.setState({ scrubbing: false });
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        console.log('onPanResponderTerminate', { evt, gestureState })
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
    this.state = {
      scrubbing: false,
      scrubbingValue: 0,
    };
  }

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

  onScrubStart = () => {

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
    const scrubbingColor = scrubbing ? {backgroundColor: DefaultColors.scrubbedColor} : {}
    return (
      <View style={styles.root}>
        <View style={styles.trackContainer} >
          <View style={styles.backgroundTrack} />
          <View style={[styles.progressTrack, { width: `${progressPercent}%`, ...scrubbingColor }]} />
          {/* <TouchableWithoutFeedback > */}
            <View 
              style={[styles.trackSlider, { left: `${progressPercent}%`, ...scrubbingColor }]} 
              {...this._panResponder.panHandlers}
              hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
            />
          {/* </TouchableWithoutFeedback> */}
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
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    backgroundColor: DefaultColors.trackColor,
    zIndex: 1,
  },
  trackSlider: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: DefaultColors.trackColor,
    zIndex: 2,
    left: 50,
    position: 'absolute',
  }
});
