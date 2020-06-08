# React Native Scrubber
A video/audio scrubber for react native.

<img src="https://imgur.com/kiiL7pY.gif" width="300" height="256">

#### Todo
- [x] Animate scrubber
- [x] Handle buffered value
- [x] Implement scrubbing
- [ ] Scrubbing callbacks
- [ ] Custom scrubbing thresholds and rates


## Install

```
npm install react-native-scrubber 
or 
yarn add react-native-scrubber

import Scrubber from 'react-native-scrubber'
``` 

If you are using Expo, you are done.

If you don't use Expo, install and link [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler).


### Props

Name | Type | Description
:--- | :--- | :---
`value` | Number | The current value of the video/audio.
`bufferedValue` | Number | The current buffered value of the video/audio.
`totalDuration` | Number | The total duration of the video/audio (Needed to calculated animations within the scrubber). **Note** If you supply a totalDuration of 0 the starting and ending number will display both as `--:--` since we require the totalDuration to display those numbers. 
`onSlidingComplete` | Function | Callback that is called when the user releases the slider, regardless if the value has changed.
`trackBackgroundColor` | String | Hex color representing the color of the background (Unfilled) track
`trackColor` | String | Hex color representing the color of the foregroud (Filled) track.
`bufferedTrackColor` | String | Hex color representing the color of the buffered track which sits inbetween the background track and the progress track.
`scrubbedColor` | String | Hex color represending the color of the foregroud (Filled) track and the dot when the scrubber is active. Also changes the color of the starting number.
`displayedValueStyle` | Object | This stlye is applied to both the displayed values
`displayValues` | Boolean | Defaults to `true`, if set false will hide the numbers under the scrub bar.

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
          onSlidingComplete={this.valueChange}
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

### FAQ

#### What is a scrubber?
A Scrubber is a component used for audio or video to choose where in the media the user wants to navigate to.

#### Why can't I just use a slider?
I tried implementing a slider in my app at first and the problem with a slider is new values will be constantly coming in due to the audio or video playing, and a slider will jerk around while the user is scrubbing. Also a user can't fine tune the exact value on large values. Also also the React Native Slider has a limiting styling and no nice animations.
