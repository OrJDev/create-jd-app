import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface ICircleProps { }

const Circle: React.FC<ICircleProps> = ({ }) => {
    return (
        <View style={styles.circle}>
            <Text style={styles.txt}>
                Hey there
            </Text>
        </View>
    )
}

export default Circle;