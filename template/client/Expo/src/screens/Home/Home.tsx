import styles from './styles';
import React from 'react';
import { Text, View } from 'react-native';
import { Circle } from '~/components';

interface IHomeProps { }

const Home: React.FC<IHomeProps> = ({ }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.txt}>Created by create-jd-app</Text>
            <Circle />
        </View>
    )
}

export default Home;