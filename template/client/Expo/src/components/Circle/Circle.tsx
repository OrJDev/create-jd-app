import React from 'react';
import { View, Text } from 'react-native';
import { trpc } from '~/utils/trpc';
import styles from './styles';

interface ICircleProps { }

const Circle: React.FC<ICircleProps> = ({ }) => {
    const { data, isLoading } = trpc.useQuery(["example.test", { name: "Jon doe" }])
    return (
        <View style={styles.circle}>
            <Text style={styles.txt}>
                {isLoading ? "Loading..." : data ?? "Something went wrong..."}
            </Text>
        </View>
    )
}

export default Circle;