import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Heading from './Heading';
import styles from './Register.css'  
import { withRouter } from "react-router-dom";
import AuthService, {  } from "../services/authService";


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

   

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

     validateForm =()=>{

        var formIsValid = true;

        if(this.state.firstName===''){
            this.setState({firstNameErrMess:'First name is required'})
            formIsValid=false;
        }
        if(this.state.lastName===''){
            this.setState({lastNameErrMess:'Last name is required'})
            formIsValid=false;
        }
        if(this.state.email===''){
            this.setState({emailErrMess:'Email is required'})
            formIsValid=false;
        }
        if(this.state.email!=='' && this.validateEmail(this.state.email)===false){
            this.setState({emailErrMess:'Email format should be like abcd@abcd.abcd'})
            formIsValid=false;
        }
        if(this.state.password===''){
            this.setState({passwordErrMess:'Password is required'})
            formIsValid=false;
        }
        if(this.state.password!=='' && this.validatePassword(this.state.password)===false){
            this.setState({passwordErrMess:'Password should be 8-16 characters long, have at least one number and one special character'})
            formIsValid=false;
        }

        return formIsValid;
       
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validatePassword(password) {
        const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        return re.test(String(password));
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
        var succesfullySingedUp = await auth.registerUser(this.state.firstName, this.state.lastName, this.state.email, this.state.password);
        if(succesfullySingedUp){
            this.props.onLogin(this.state.firstName);
            this.props.history.push("/home");
        }
    }

    render() {
        return (
           <div>
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
                                    <small hidden={this.state.firstNameErrMess===''}>{this.state.firstNameErrMess}</small>
                                </div>
                                <div className="form-group">
                                    <label className="formLabel" >Last Name</label>
                                    <input type="text" name="lastName" className="form-control" value={this.state.lastName} onChange={this.onChange}/>
                                    <small hidden={this.state.lastNameErrMess===''}>{this.state.lastNameErrMess}</small>
                                 </div>
                                 <div className="form-group">
                                    <label className="formLabel" >Enter Email</label>
                                    <input type="text" name="email" className="form-control" value={this.state.email} onChange={this.onChange} />
                                    <small hidden={this.state.emailErrMess===''}>{this.state.emailErrMess}</small>
                                </div>
                                <div className="form-group">
                                    <label className="formLabel" >Password</label>
                                    <input type="password" name="password" className="form-control" value={this.state.password} onChange={this.onChange} />
                                    <small hidden={this.state.passwordErrMess===''}>{this.state.passwordErrMess}</small>
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

