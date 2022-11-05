import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import './app.css';
import { PickerPage } from "./components/picker-page";

function App() {

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
        <Tabs isFitted height="100%" display="flex" flexDirection="column">
          <TabList>
            <Tab>1</Tab>
            <Tab>2</Tab>
            <Tab>3</Tab>
          </TabList>

          <TabPanels overflow="hidden">
            <TabPanel padding="0" height="100%">
              <PickerPage page={1} />
            </TabPanel>
            <TabPanel padding="0" height="100%">
              <PickerPage page={2} />
            </TabPanel>
            <TabPanel padding="0" height="100%">
              <PickerPage page={3} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}

export default App;
