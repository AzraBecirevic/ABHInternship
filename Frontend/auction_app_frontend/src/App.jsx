import './App.css';
import Header from './components/Header'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Footer from './components/Footer'
import AboutUs from './components/AboutUs';
import Home from './components/Home';
import TearmsAndConditions from './components/TearmsAndConditions';
import PrivacyAndPolicy from './components/PrivacyAndPolicy';
import ScrollToTop from './components/ScrollToTop';


function App() {
 
   function openPage(e, url){
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}
  

  return (
    <Router>
      <ScrollToTop>
        <div className="app">
          <Header openMe={openPage}/>
          <div className="containerDiv">
            <Route path="/" exact component={Home}></Route>
            <Route path="/about" component={AboutUs}></Route>
            <Route path="/tearmsConditions" component={TearmsAndConditions}></Route>
            <Route path="/privacyPolicy" component={PrivacyAndPolicy}></Route>
          </div>
          <Footer openLink={openPage}/>
        </div>
      </ScrollToTop>
    </Router>
    
  );
}

export default App;
