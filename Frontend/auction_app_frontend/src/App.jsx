import './App.css';
import Header from './components/Header'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Footer from './components/Footer'
import AboutUs from './components/AboutUs';
import Home from './components/Home';
import TearmsAndConditions from './components/TearmsAndConditions';
import PrivacyAndPolicy from './components/PrivacyAndPolicy';
import ScrollToTop from './components/ScrollToTop';
import Register from './components/Register';
import React, { Component } from 'react'
import { ABOUT_ROUTE, HOME_ROUTE, PRIVACY_POLICY_ROUTE, REGISTER_ROUTE, TEARMS_CONDITIONS_ROUTE } from './constants/routes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export class App extends Component {

  state ={
    isLoggedIn:false,
    userName:''
  }

  loginCustomer=(name)=>{
    this.setState({isLogiran:true, userName:name});
  }

  openPage(e, url){
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;

  }

  render() {
    return (
      <Router>
        <ScrollToTop>
          <div className="app">
            <Header openMe={this.openPage}/>
            <div className="containerDiv">
              <Route path={HOME_ROUTE} exact component={Home}></Route>
              <Route path={ABOUT_ROUTE} component={AboutUs}></Route>
              <Route path={TEARMS_CONDITIONS_ROUTE} component={TearmsAndConditions}></Route>
              <Route path={PRIVACY_POLICY_ROUTE} component={PrivacyAndPolicy}></Route>
              <Route path={REGISTER_ROUTE} render={(props) => <Register {...props} onLogin={this.loginCustomer} />} /> 
            </div>
            <Footer openLink={this.openPage}/>
          </div>
        </ScrollToTop>
      </Router>
    )
  }
}

export default App

