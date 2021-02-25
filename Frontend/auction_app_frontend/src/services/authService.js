 class AuthService{
    
   endpoint;
   port;
   
    async login(firstName, email, password, showError){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ email:email, password:password })
        };
        const response = await fetch(this.endpoint + this.port  + '/login', requestOptions)
        .catch(error => {
            if (!error.response) {
                return null;
             } 
             else {
                return;
             }
          });
 
        if(!response){
            showError("Connection refused. Please try later.");
            return false;
        }
      
        if(response.status === 200){
            window.sessionStorage.setItem('token', response.headers.get('authorization'));
            sessionStorage.setItem('userName',firstName);
            return true;     
        }
        else{
            showError("Something went wrong with your registration");
            return false;
        }
      
    }
    
    
     async registerUser(firstName, lastName, email, password, showError ){
         
       if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            this.endpoint = process.env.REACT_APP_API_ENDPOINT_DEVELOP;
            this.port = process.env.REACT_APP_API_PORT_DEVELOP;
            console.log("dev");
        
        
        } else {
            this.endpoint = process.env.REACT_APP_API_ENDPOINT_PRODUCTION;
            this.port = process.env.REACT_APP_API_PORT_PRODUCTION;
            console.log("prod");
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName:firstName, lastName:lastName, email:email, password:password })
        };
    
       
       const response = await fetch(  this.endpoint + this.port  +  '/customer', requestOptions)  
       .catch(error => {
           if (!error.response) {
               return null;
            } 
            else {
               return;
            }
         });

       if(!response){
           showError("Connection refused. Please try later.");
           return false;
        }
        if(response.status === 201){
            return this.login(firstName, email, password, showError)
        }
        else{
            var data = await response.json();
            showError(data.text);
            return false;
        }
    
    }
    
 }

 export default AuthService;