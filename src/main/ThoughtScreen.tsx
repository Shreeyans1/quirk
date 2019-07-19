import React from "react";
import ScreenProps from "../ScreenProps";
import { View } from "react-native";
import { getExercises } from "../thoughtstore";
import { SavedThought, ThoughtGroup, groupThoughtsByDay } from "../thoughts";
import { validThoughtGroup } from "../sanitize";
import parseThoughts from "./parseThoughts";
import ThoughtList from "./ThoughtList";
import ThoughtCard from "./ThoughtCard";
import { DISTORTION_SCREEN } from "./screens";

export default class MainScreen extends React.Component<ScreenProps> {
  static navigationOptions = {
    header: null,
  };

  state = {
    isReady: false,
    groups: [],
  };

  loadExercises = () => {
    getExercises()
      .then(data => {
        const thoughts: SavedThought[] = parseThoughts(data);
        const groups: ThoughtGroup[] = groupThoughtsByDay(thoughts).filter(
          validThoughtGroup
        );

        this.setState({ groups });
      })
      .catch(console.error)
      .finally(() => {
        this.setState({
          isReady: true,
        });
      });
  };

  navigateToViewerWithThought = (thought: SavedThought) => {
    console.log("Navigate to", thought);
  };

  navigateToDistortionScreenWithThought = (automaticThought: string) => {
    this.props.navigation.push(DISTORTION_SCREEN, {
      automaticThought,
    });
  };

  render() {
    const { groups } = this.state;

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThoughtCard onNext={this.navigateToDistortionScreenWithThought} />
        <ThoughtList
          groups={groups}
          historyButtonLabel={"alternative-thought"}
          navigateToViewer={this.navigateToViewerWithThought}
          // onItemDelete={this.onItemDelete}
        />
      </View>
    );
  }
}