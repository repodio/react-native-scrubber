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

  createPanHandler = () => PanResponder.create({
    onStartShouldSetPanResponder: ( event, gestureState ) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderGrant: ( event, gestureState) => {
      const boundedX = Math.min(Math.max(this.value.x, 0), this.state.dimensionWidth - TrackSliderSize);
      console.log('onPanResponderGrant', boundedX)
      this.animatedValue.setOffset({
        x: boundedX,
        y: this.value.y
      })
      this.setState({ scrubbing: true });
    },
    onPanResponderMove: Animated.event([ null, { dx: this.animatedValue.x, dy: this.animatedValue.y}]),
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      // console.log('onPanResponderRelease', { evt, gestureState })
      const { moveX, moveY, dx, dy } = gestureState;
      const { dimensionWidth, dimensionOffset } = this.state;
      const { totalDuration } = this.props;

      const boundedX = Math.min(Math.max(this.value.x, 0), dimensionWidth);

      const percentScrubbed = boundedX / dimensionWidth;
      const scrubbingValue = percentScrubbed * totalDuration
      // console.log('onPanResponderRelease: ', {
      //   scrubbingValue, boundedX: Math.min(Math.max(this.value.x, 0), this.state.dimensionWidth)
      // })
      this.onValueChange(scrubbingValue)
      this.setState({ scrubbing: false });
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

    return `-${scrubbing 
      ? formatValue(endingNumberValue)
      : formatValue(totalDuration - value)}`
  }

  onValueChange = (scrubbingValue) => {
    console.log('changing value to ', scrubbingValue)
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
      value,
      totalDuration,
    } = this.props;

    const {
      scrubbing,
      dimensionWidth,
      dimensionOffset
    } = this.state;
    
    
    const progressPercent = value / totalDuration;
    const displayPercent = progressPercent * (dimensionWidth);
    const scrubbingColor = scrubbing ? {backgroundColor: DefaultColors.scrubbedColor} : {}


    let boundX = progressPercent

    if(dimensionWidth) {
      boundX = this.animatedValue.x.interpolate({
        inputRange: [0, dimensionWidth],
         outputRange: [0, dimensionWidth],
         extrapolate: 'clamp'
       })
    }

    const progressWidth = progressPercent * 100

    
    return (
      <View style={styles.root}>
        <View style={styles.trackContainer} onLayout={this.onLayoutContainer}>
          <View style={styles.backgroundTrack} />
          <Animated.View 
            style={[
              styles.progressTrack,
              { ...scrubbingColor },
              !scrubbing 
                ? { width: `${progressWidth}%`}
                : { width: boundX }
            
            ]} />

          <Animated.View 
            style={[
              styles.trackSlider,
              { ...scrubbingColor },
              // { left: progressPercent * dimensionWidth },
              !scrubbing 
                ? { transform: [{translateX: displayPercent}] }
                : { transform: [{translateX: boundX}] },

              !scrubbing 
                ? { transform: [{translateX: displayPercent}] }
                : { transform: [{translateX: boundX}] },
            ]} 
            {...this.panResponder.panHandlers}
            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
          />
        </View>

        <View style={styles.valuesContainer} >
          <Animated.Text style={styles.value}>{this.formattedStartingNumber(boundX)}</Animated.Text>
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
    backgroundColor: DefaultColors.trackBackgroundColor,
  },
  progressTrack: {
    position: 'absolute',
    height: 3,
    width: 0,
    left: 0,
    // marginLeft: TrackSliderSize / 2,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    backgroundColor: DefaultColors.trackColor,
    zIndex: 1,
  },
  trackSlider: {
    width: TrackSliderSize,
    height: TrackSliderSize,
    borderRadius: TrackSliderSize,
    backgroundColor: DefaultColors.trackColor,
    // borderWidth: 1,
    borderColor: '#fff',
    zIndex: 2,
    // left: 0 - TrackSliderSize / 2,
    position: 'absolute',
  }
});
