import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Heading from './Heading';
import styles from './Register.css'  
import { withRouter } from "react-router-dom";
import AuthService, {  } from "../services/authService";
import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants/regex';

import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


export class Register extends Component {

    constructor(props){
        super(props);
    }

    state = {
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        firstNameErrMess:'',
        lastNameErrMess:'',
        emailErrMess:'',
        passwordErrMess:'',
        token:''
    }

    validateEmailFormat(email) {
        const re = EMAIL_REGEX;
        return re.test(String(email).toLowerCase());
    }

    validatePasswordFormat(password) {
    
        const re = PASSWORD_REGEX;
        return re.test(String(password));  
    }


    validateFirstName=()=>{
        if(this.state.firstName===''){
            this.setState({firstNameErrMess:'First name is required'})
            return false;
        }
        return true;
    }

    validateLastName=()=>{
        if(this.state.lastName===''){
            this.setState({lastNameErrMess:'Last name is required'})
            return false;
        }
        return true;
    }
    
    validateEmail=()=>{
        if(this.state.email===''){
            this.setState({emailErrMess:'Email is required'})
           return false;
        }
        if(this.state.email!=='' && this.validateEmailFormat(this.state.email)===false){
            this.setState({emailErrMess:'Expected email format: example@example.com'})
            return false;
        }
        return true;
    }

    validatePassword=()=>{
        if(this.state.password===''){
            this.setState({passwordErrMess:'Password is required'})
            return false;
        }
        if(this.state.password!=='' && this.validatePasswordFormat(this.state.password)===false){
            this.setState({passwordErrMess:'Password should be 8-16 characters long, have at least one number or one special character'})
            return false;
        }
        return true;
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

     validateForm =()=>{

        var formIsValid = true;

        if(this.validateFirstName()===false){ formIsValid = false; }

        if(this.validateLastName()=== false){ formIsValid = false; }
        
        if(this.validateEmail() === false){ formIsValid = false; }
       
        if(this.validatePassword() === false){ formIsValid = false; }

        return formIsValid;
       
    }


    onSubmit=(e)=>{
        this.setState({firstNameErrMess:'', lastNameErrMess:'', emailErrMess:'', passwordErrMess:'' })

        e.preventDefault();

        if(this.validateForm()){
            this.registerUser();
        }
    }


    registerUser=async()=>{
        const auth = new AuthService();
        var succesfullySingedUp = await auth.registerUser(this.state.firstName, this.state.lastName, this.state.email, this.state.password, this.showError);
        if(succesfullySingedUp){
            this.props.onLogin(this.state.firstName);
            this.props.history.push("/home");
        }
    }

    showError=(errorMessage)=>{
        toast(errorMessage);
    }

    render() {
        return (
           <div>
               <ToastContainer position="top-center"></ToastContainer>
               <Heading title='REGISTER'></Heading>
               <div className="row">
                   <div className="col-lg-2"></div>
                   <div className="col-lg-8">
                       <div className="register">
                           <div className="registerHeadingDiv">
                               <p className="registerHeading">REGISTER</p>  
                            </div>
                        <div className="formDiv">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label className="formLabel" >First Name</label>
                                    <input type="text" name="firstName" className="form-control" value={this.state.firstName} onChange={this.onChange}/>
                                    <small className="errorMessage" hidden={this.state.firstNameErrMess===''}>{this.state.firstNameErrMess}</small>
                                </div>
                                <div className="form-group">
                                    <label className="formLabel" >Last Name</label>
                                    <input type="text" name="lastName" className="form-control" value={this.state.lastName} onChange={this.onChange}/>
                                    <small className="errorMessage"  hidden={this.state.lastNameErrMess===''}>{this.state.lastNameErrMess}</small>
                                 </div>
                                 <div className="form-group">
                                    <label className="formLabel" >Enter Email</label>
                                    <input type="text" name="email" className="form-control" value={this.state.email} onChange={this.onChange} />
                                    <small className="errorMessage"  hidden={this.state.emailErrMess===''}>{this.state.emailErrMess}</small>
                                </div>
                                <div className="form-group">
                                    <label className="formLabel" >Password</label>
                                    <input type="password" name="password" className="form-control" value={this.state.password} onChange={this.onChange} />
                                    <small className="errorMessage"  hidden={this.state.passwordErrMess===''}>{this.state.passwordErrMess}</small>
                                </div>
                                <button type="submit" className="block" >REGISTER</button>
                            </form>
                            <p className="formMessage">Already have an account? <Link className="formLoginLink" to="/login">Login</Link></p>
                        </div>
                        </div>
                   </div>
                   <div className="col-lg-2"></div>
                </div>

           </div>
           
        )
    }
}

export default withRouter(Register);

