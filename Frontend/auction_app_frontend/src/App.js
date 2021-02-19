import './App.css';
import Header from './components/Header'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Footer from './components/Footer'
import AboutUs from './components/AboutUs';
import Home from './components/Home';


function App() {
  var currentRouteName = Route.path; // this.context.router.getCurrentPathname();
   //this.context.router.transitionTo(currentRouteName, {lang: 'de'});

   
  

  return (
    <Router>
      <div className="App">
         <Header/>
         <div style={{paddingBottom:'360px'}}>  
         <Route path="/" exact component={Home}></Route>
        <Route path="/about" component={AboutUs}></Route>
    
         </div>
         
        <Footer/>
      </div>
    </Router>
    
  );
}

export default App;
