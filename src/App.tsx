import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import Campaign from "./pages/Campaign";
import CreateCampaign from "./pages/CreateCampaign";
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster />
      <main className='md:w-[90%] lg:w-[80%] mx-auto'>
        <Navigation />

        <Routes>
          <Route index element={<Home />} />
          <Route path='/create' element={<CreateCampaign />} />
          <Route path='/campaign/:address' element={<Campaign />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
