import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import Campaign from "./pages/Campaign";

function App() {
  return (
    <main className='md:w-[90%] lg:w-[80%] mx-auto'>
      {/* <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>dApp Starter Template</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />
        </Container>
      </Container> */}

      <Navigation />

      <Routes>
        <Route index element={<Home />} />
        <Route path='/campaign/:title' element={<Campaign />} />
      </Routes>
    </main>
  );
}

export default App;
