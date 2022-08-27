import { StyleSheet } from "react-native";

const CIRCLE_SIZE = 200;

export default StyleSheet.create({
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "green",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
