import { Component } from 'react';
import { TextStyle } from 'react-native';

interface ScrubberProps {
    value?: number;
    bufferedValue?: number;
    totalDuration?: number;
    onSlidingComplete: (value: number) => void;
    tapNavigation?: boolean;
    trackBackgroundColor?: string;
    trackColor?: string;
    bufferedTrackColor?: string;
    scrubbedColor?: string;
    displayedValueStyle?: TextStyle
}

declare class Scrubber extends Component<ScrubberProps, any> {}

export = Scrubber
