import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import './app.css';
import { Game, PickerPage } from "./components/picker-page";
import { TransitionPage } from "./components/transition-page";

function App() {

  const [tabIndex, setTabIndex] = useState(0)
  const [currentTransitionGame, setCurrentTransitionGame] = useState<Game>()

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const startTransition = useCallback((currentGame: Game) => {
    setCurrentTransitionGame(currentGame);
    setTabIndex(3);
  }, []);

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
        <Tabs isFitted height="100%" display="flex" flexDirection="column" index={tabIndex} onChange={handleTabsChange}>
          <TabList>
            <Tab>1. Spiel</Tab>
            <Tab>2. Spiel</Tab>
            <Tab>Playground</Tab>
            <Tab>Transition</Tab>
          </TabList>

          <TabPanels overflow="hidden" height="100%">
            <TabPanel padding="0" height="100%">
              <PickerPage page="first-game" title="1. Spiel" startTransition={startTransition}/>
            </TabPanel>
            <TabPanel padding="0" height="100%">
              <PickerPage page="second-game" title="2. Spiel" startTransition={startTransition}/>
            </TabPanel>
            <TabPanel padding="0" height="100%">
              <PickerPage page="playground" title="Playground" startTransition={startTransition}/>
            </TabPanel>
            <TabPanel padding="0" height="100%">
              <TransitionPage page="transition" game={currentTransitionGame}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}

export default App;
