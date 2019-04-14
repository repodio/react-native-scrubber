# React Native Scrubber
A video/audio scrubber for react native.

#### Todo
- [x] Animate scrubber
- [ ] Add scrubbing callbacks


## Install

```
npm install react-native-scrubber 
or 
yarn add react-native-scrubber`

import Scrubber from 'react-native-scrubber'
``` 

### Props

Name | Type | Description
:--- | :--- | :---
`value` | Number | The current value of the video/audio.
`onValueChange` | Function | The callback to update the value.
`totalDuration` | Number | The total duration of the video/audio (Needed to calculated animations within the scrubber)
`trackBackgroundColor` | String | Hex color representing the color of the background (Unfilled) track
`trackColor` | String | Hex color representing the color of the foregroud (Filled) track.
`scrubbedColor` | String | Hex color represending the color of the foregroud (Filled) track and the dot when the scrubber is active. Also changes the color of the starting number.

## Example

```javascript
import React, { Component } from 'react'
import { View, Text } from 'react-native'
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
      <View>
        <Scrubber 
          value={this.state.scrubberValue}
          onValueChange={this.valueChange}
          totalDuration={7000}
          trackColor='#666'
          scrubbedColor='#8d309b'
        />
      </View>
    );
  }
}

export default Example
```
