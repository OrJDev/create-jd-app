import { IUtil } from "~types/Installer";
import {getStyle} from "~utils/react";

const getCircle: IUtil = (ctx) => {
  const useTW = ctx.installers.includes("TailwindCSS");
  return `import React from 'react';
import { View, Text } from 'react-native';${
    ctx.initServer ? "\nimport { trpc } from '~/utils/trpc';" : ""
  }${useTW ? "" : "\nimport styles from './styles';"}

interface ICircleProps { }

const Circle: React.FC<ICircleProps> = ({ }) => {
${circleComp(useTW, ctx.initServer)}
}

export default Circle;`;
};

const circleComp = (useTW: boolean, initServer: boolean) => `${
  initServer
    ? '    const { data, isLoading } = trpc.useQuery(["example.test", { name: "Jon doe" }])\n'
    : ""
}    return (
        <View ${getStyle(
          useTW,
          "bg-green-700 rounded-full w-40 h-40 items-center justify-center",
          "circle"
        )}>
            <Text ${getStyle(useTW, "text-white font-bold text-xl", "txt")}>
                ${
                  initServer
                    ? '{isLoading ? "Loading..." : data ?? "Something went wrong..."}'
                    : "Hey there"
                }
            </Text>
        </View>
    )`;

export default getCircle;
