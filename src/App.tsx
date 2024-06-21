import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import './app.css';
import { Game, PickerPage } from "./components/picker-page";
import { TransitionPage } from "./components/transition-page";
import { GameTransitionContext } from "./game-transition-context";

function App() {

  const [tabIndex, setTabIndex] = useState(0);
  const [currentTransitionGame, setCurrentTransitionGame] = useState<Game>()
  const [lastAppliedTransition, setLastAppliedTransition] = useState<{gameId: string, selectedPlayerNumbers: Array<number>}>()

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const startTransition = (currentGame: Game) => {
    setCurrentTransitionGame(currentGame);
    setTabIndex(3);
  };

  const handleApplyTransition = (gameId?: string, selectedPlayerNumbers?: Array<number>) => {
    if (gameId === undefined || selectedPlayerNumbers === undefined) {
      return;
    }

    setLastAppliedTransition({
      gameId: gameId,
      selectedPlayerNumbers: selectedPlayerNumbers,
    });
    setCurrentTransitionGame(undefined);

    if (gameId === 'first-game') {
      setTabIndex(0);
    }
    if (gameId === 'second-game') {
      setTabIndex(1);
    }
    if (gameId === 'playground') {
      setTabIndex(2);
    }
  };

  const gameTransitionContext = {
    applyTransition: handleApplyTransition,
    lastAppliedTransition: lastAppliedTransition,
    startTransition: startTransition,
  };

  return (
    <Flex width="100%" height="100vh" justifyContent="center" alignItems="center">
      <Flex
        borderRadius="0.625rem"
        boxShadow="0px 0px 0.5rem 0px #B9B9B9"
        backgroundColor="gray.50"
        width="100%"
        height="100%"
        overflow="auto"
        direction="column"
        userSelect="none"
      >
        <GameTransitionContext.Provider value={gameTransitionContext}>
          <Tabs
            isFitted
            isLazy // this prevents the initial layout animation when entering the transition page the fist time
            height="100%"
            display="flex"
            flexDirection="column"
            index={tabIndex}
            onChange={handleTabsChange}
          >
            <TabList>
              <Tab className="main-tab">Spiel 1</Tab>
              <Tab className="main-tab">Spiel 2</Tab>
              <Tab className="main-tab">Test</Tab>
              <Tab className="main-tab" whiteSpace="nowrap" isDisabled={currentTransitionGame === undefined}>{currentTransitionGame === undefined ? 'Transition' : `🔁 ${currentTransitionGame?.title}`}</Tab>
            </TabList>

            <TabPanels overflow="hidden" height="100%">
              <TabPanel padding="0" height="100%">
                <PickerPage page="first-game" title="Spiel 1"/>
              </TabPanel>
              <TabPanel padding="0" height="100%">
                <PickerPage page="second-game" title="Spiel 2"/>
              </TabPanel>
              <TabPanel padding="0" height="100%">
                <PickerPage page="playground" title="Test"/>
              </TabPanel>
              <TabPanel padding="0" height="100%">
                <TransitionPage game={currentTransitionGame} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GameTransitionContext.Provider>
      </Flex>
    </Flex>
  );
}

export default App;
