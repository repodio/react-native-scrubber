import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'

export default class extends Component {

  static propTypes = {
  }

  render() {
    return <View style={styles.root}><Text>scrubber</Text></View>
  }
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 50,
    backgroundColor: 'red'
  },
});
