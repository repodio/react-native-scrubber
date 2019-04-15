import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  PanResponder,
  Animated,
} from 'react-native'

const DefaultColors = {
  valueColor: '#999',
  trackBackgroundColor: '#DDD',
  trackColor: '#666',
  scrubbedColor: 'red',
}

const TrackSliderSize = 10;
const SCALE_UP_DURAITON = 150;

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
    this.initiateAnimator();
    
    this.scaleFactor = new Animated.Value(0);

    this.state = {
      scrubbing: false,
      scrubbingValue: 0,
      dimensionWidth: 0,
      dimensionOffset: 0,
      startingNumberValue: props.value,
    };
  }

  static propTypes = {
  }

  scaleUp = () => {
    Animated.timing(this.scaleFactor, {
        toValue: 1,
        duration: SCALE_UP_DURAITON
    }).start();
  }

  scaleDown = () => {
    Animated.timing(this.scaleFactor, {
        toValue: 0,
        duration: SCALE_UP_DURAITON
    }).start();
  }

  createPanHandler = () => PanResponder.create({
    onStartShouldSetPanResponder: ( event, gestureState ) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderGrant: ( event, gestureState) => {
      const { totalDuration, value } = this.props;
      const currentPercent = totalDuration !== 0 ? Math.min(totalDuration, value) / totalDuration : 0
      const initialX = currentPercent * this.state.dimensionWidth
      const boundedX = Math.min(Math.max(initialX, 0), this.state.dimensionWidth - TrackSliderSize);

      this.animatedValue.setOffset({
        x: boundedX,
        y: this.value.y
      })
      this.setState({ scrubbing: true }, this.scaleUp);
    },
    onPanResponderMove: Animated.event([ null, { dx: this.animatedValue.x, dy: this.animatedValue.y}]),
    onPanResponderRelease: (evt, gestureState) => {
      const { dimensionWidth, dimensionOffset } = this.state;
      const { totalDuration } = this.props;

      const boundedX = Math.min(Math.max(this.value.x, 0), dimensionWidth);

      const percentScrubbed = boundedX / dimensionWidth;
      const scrubbingValue = percentScrubbed * totalDuration

      this.onValueChange(scrubbingValue)
      this.setState({ scrubbing: false }, this.scaleDown);
    }
  })

  formattedStartingNumber = () => {
    const { scrubbing, startingNumberValue } = this.state;
    const { value } = this.props;

    return scrubbing 
      ? formatValue(startingNumberValue)
      : formatValue(value)
  }

  formattedEndingNumber = () => {
    const { value, totalDuration } = this.props;
    const { scrubbing, endingNumberValue } = this.state;
    const cappedValue = Math.min(totalDuration, value)
    const remainingValue = totalDuration - cappedValue

    return `-${scrubbing 
      ? formatValue(endingNumberValue || remainingValue)
      : formatValue(remainingValue)}`
  }

  onValueChange = (scrubbingValue) => {
    this.props.onValueChange(scrubbingValue);
  }


  onLayoutContainer = async (e) => {
    await this.setState({
      dimensionWidth: e.nativeEvent.layout.width,
    })
    this.initiateAnimator()
  }

  initiateAnimator = () => {
    
    this.animatedValue = new Animated.ValueXY({x: 0, y: 0 })
    this.value = {x: 0, y: 0 }
    this.animatedValue.addListener((value) => {
      const boundedValue = Math.min(Math.max(value.x, 0), this.state.dimensionWidth);
      this.setState({
        startingNumberValue: (boundedValue / this.state.dimensionWidth) * this.props.totalDuration,
        endingNumberValue: (1 - (boundedValue / this.state.dimensionWidth)) * this.props.totalDuration
      })
      return this.value = value
    });
    this.panResponder = this.createPanHandler()
  }

  render() {
    const {
      value = 0,
      totalDuration = 1,
      valueColor = DefaultColors.valueColor,
      trackBackgroundColor = DefaultColors.trackBackgroundColor,
      trackColor = DefaultColors.trackColor,
      scrubbedColor = DefaultColors.scrubbedColor,
    } = this.props;
    
    const {
      scrubbing,
      dimensionWidth,
      dimensionOffset
    } = this.state;
    
    
    const cappedValue = Math.min(totalDuration, value)
    
    const progressPercent = totalDuration !== 0 ? cappedValue / totalDuration : 0;
    const displayPercent = progressPercent * (dimensionWidth);
    const scrubberColor = 
      scrubbing
        ? { backgroundColor: scrubbedColor }
        : { backgroundColor: trackColor }

    const progressBarColor = 
      scrubbing
        ? { backgroundColor: scrubbedColor }
        : { backgroundColor: trackColor }

    const startingValueColor = 
      scrubbing
        ? { color: scrubbedColor }
        : { color: valueColor }
    
    const backgroundValueColor = { color: valueColor }
    const backgroundBarColor = { backgroundColor: trackBackgroundColor }
  
    let boundX = progressPercent

    if(dimensionWidth) {
      boundX = this.animatedValue.x.interpolate({
        inputRange: [0, dimensionWidth],
        outputRange: [0, dimensionWidth],
        extrapolate: 'clamp'
      })
    }

    const scaleValue = this.scaleFactor.interpolate({
      inputRange: [0, 1],
      outputRange: [1.0, 2.0],
    })
    const scaleStyle = { scale: scaleValue };

    const progressWidth = progressPercent * 100
    
    return (
      <View style={styles.root}>
        <View style={styles.trackContainer} onLayout={this.onLayoutContainer}>
          <View style={[styles.backgroundTrack, backgroundBarColor]} />
          <Animated.View 
            style={[
              styles.progressTrack,
              { ...progressBarColor },
              !scrubbing 
                ? { width: `${progressWidth}%`}
                : { width: boundX }
            
            ]} />

          <Animated.View 
            style={[
              styles.trackSlider,
              { ...scrubberColor },
              // { left: progressPercent * dimensionWidth },
              
              !scrubbing 
                ? { transform: [{translateX: displayPercent}, scaleStyle] }
                : { transform: [{translateX: boundX}, scaleStyle] },

              !scrubbing 
                ? { transform: [{translateX: displayPercent}, scaleStyle] }
                : { transform: [{translateX: boundX}, scaleStyle] },
              
            ]} 
            {...this.panResponder.panHandlers}
            hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
          />
        </View>

        <View style={styles.valuesContainer} >
          <Text style={startingValueColor}>{this.formattedStartingNumber()}</Text>
          <Text style={backgroundValueColor}>{this.formattedEndingNumber()}</Text>
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
  trackContainer: {
    position: 'relative',
    height: 20,
    paddingTop: TrackSliderSize / 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backgroundTrack: {
    position: 'absolute',
    height: 3,
    width: '100%',
    borderRadius: 3,
  },
  progressTrack: {
    position: 'absolute',
    height: 3,
    width: 0,
    left: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    zIndex: 1,
  },
  trackSlider: {
    width: TrackSliderSize,
    height: TrackSliderSize,
    borderRadius: TrackSliderSize,
    borderColor: '#fff',
    zIndex: 2,
    position: 'absolute',
  }
});
