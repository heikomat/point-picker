import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
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

  const startTransition = useCallback((currentGame: Game) => {
    setCurrentTransitionGame(currentGame);
    setTabIndex(3);
  }, []);

  const handleApplyTransition = useCallback((gameId?: string, selectedPlayerNumbers?: Array<number>) => {
    if (gameId === undefined || selectedPlayerNumbers === undefined) {
      return;
    }

    setLastAppliedTransition({
      gameId: gameId,
      selectedPlayerNumbers: selectedPlayerNumbers,
    });

    if (gameId === 'first-game') {
      setTabIndex(0);
    }
    if (gameId === 'second-game') {
      setTabIndex(1);
    }
    if (gameId === 'playground') {
      setTabIndex(2);
    }
  }, []);

  const gameTransitionContext = useMemo(() => {
    return {
      applyTransition: handleApplyTransition,
      lastAppliedTransition: lastAppliedTransition,
      startTransition: startTransition,
    }
  }, [handleApplyTransition, lastAppliedTransition, startTransition]);

  return (
    <Flex width="100%" height="100vh" justifyContent="center" alignItems="center">
      <Flex
        borderRadius="10px"
        boxShadow="0px 0px 8px 0px #B9B9B9"
        backgroundColor="gray.50"
        width="100%"
        maxWidth="500px"
        height="100%"
        maxHeight="1200px"
        overflow="auto"
        direction="column"
        userSelect="none"
      >
        <GameTransitionContext.Provider value={gameTransitionContext}>
          <Tabs isFitted height="100%" display="flex" flexDirection="column" index={tabIndex} onChange={handleTabsChange}>
            <TabList>
              <Tab>1. Spiel</Tab>
              <Tab>2. Spiel</Tab>
              <Tab>Playground</Tab>
              <Tab>Transition</Tab>
            </TabList>

            <TabPanels overflow="hidden" height="100%">
              <TabPanel padding="0" height="100%">
                <PickerPage page="first-game" title="1. Spiel"/>
              </TabPanel>
              <TabPanel padding="0" height="100%">
                <PickerPage page="second-game" title="2. Spiel"/>
              </TabPanel>
              <TabPanel padding="0" height="100%">
                <PickerPage page="playground" title="Playground"/>
              </TabPanel>
              <TabPanel padding="0" height="100%">
                <TransitionPage page="transition" game={currentTransitionGame} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GameTransitionContext.Provider>
      </Flex>
    </Flex>
  );
}

export default App;
