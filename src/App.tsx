import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Generator from './pages/Generator';
import About from './pages/About';
import { LayersProvider } from './contexts/LayersContext';

function App() {
  return (
    <Router>
      <LayersProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </LayersProvider>
    </Router>
  );
}

export default App;