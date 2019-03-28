import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class animatedbasic extends Component {
  
  constructor(props) {
    super(props);

    this.animatedValue = new Animated.ValueXY();
    this._value = {x: 0, y: 0}
    this.animatedValue.addListener((value) => this._value = value);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        this.animatedValue.setOffset({
          x: this._value.x,
          y: this._value.y,
        })
        this.animatedValue.setValue({ x: 0, y: 0})
      },
      onPanResponderMove: Animated.event([
        null, { dx: this.animatedValue.x, dy: this.animatedValue.y}
      ]),
      onPanResponderRelease: (e, gestureState) => {
        this.animatedValue.flattenOffset();
        
      },
    })
    this.state = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      measured: false,
    }
  }

  onLayoutContainer = async (e) => {
    await this.setState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
      x: e.nativeEvent.layout.x,
      y: e.nativeEvent.layout.y,
      measured: true,
    })
    this.initiateAnimator()
  }

  initiateAnimator = () => {
    this.animatedValue = new Animated.ValueXY({x: 0, y: 0 })
    this.value = {x: 0, y: 0 }
    this.animatedValue.addListener((value) => this.value = value)
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: ( event, gestureState ) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onPanResponderGrant: ( event, gestureState) => {
        this.animatedValue.setOffset({
          x: this.value.x,
          y: this.value.y
        })
      },
      onPanResponderMove: Animated.event([ null, { dx: this.animatedValue.x, dy: this.animatedValue.y}]),
    })
  }

  _renderBox = () => {
    if(!this.state.measured) {
      return null;
    }
    const boundX = this.animatedValue.x.interpolate({
      inputRange: [-10, this.state.width - 10],
       outputRange: [-10, this.state.width - 10],
       extrapolate: 'clamp'
     })
    // console.log('bounds', boundX)
    const animatedStyle = {
      transform: [{translateX: boundX}, {translateY: 0}]
    }

    return (
      <Animated.View style={[styles.box, animatedStyle]} {...this.panResponder.panHandlers}/>
    )
  }

  render() {
    return (
        <View style={styles.root} onLayout={this.onLayoutContainer}>
          {this._renderBox()}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFF",
    fontSize: 20,
  }
});