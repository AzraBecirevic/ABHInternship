import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Heading from './Heading';
import styles from './Register.css'  

export class Register extends Component {

    state = {
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        firstNameErrMess:'',
        lastNameErrMess:'',
        emailErrMess:'',
        passwordErrMess:''
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

    login=async()=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username:this.state.email, password:this.state.password })
        };
        const response = await fetch('http://localhost:8081/login', requestOptions);
        if(response.status === 200){
            console.log("logiran");
          //  var data = response.json();
           // console.log(data);
            console.log(response);
           console.log(response.headers['Authorization'])
            //console.log(response.);
           
        }

        /*fetch('http://localhost:8081/login', requestOptions).then(response => response.json())
        .then(data => console.log(data) );*/
    }

    registerUser= async()=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName:this.state.firstName, lastName:this.state.lastName, username:this.state.email, password:this.state.password })
        };

       const response = await fetch('http://localhost:8081/customer', requestOptions);
        if(response.status === 201){
            console.log("logiranje")
            this.login()
        }
        else{
            console.log(response.json());
        }
        
    }

    /*getData(){   
        
        fetch('http://localhost:8081/ping')
        .then(response => response.json())
        .then(data => console.log(data) );   // this.setState({  })
    }*/

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

export default Register
