
 class AuthService{

    async login(firstName, username, password){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ username:username, password:password })
        };
        const response = await fetch('http://localhost:8081/login', requestOptions)
      
        if(response.status === 200){
            window.sessionStorage.setItem('token', response.headers.get('authorization'));
            sessionStorage.setItem('userName',firstName);
            return true;     
        }
        else{
            alert("Something went wrong with your registarion"); 
            return false;
        }
      
    }
    
    
     async registerUser(firstName, lastName, email, password ){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName:firstName, lastName:lastName, username:email, password:password })
        };
    
       const response = await fetch('http://localhost:8081/customer', requestOptions);
        if(response.status === 201){
            return this.login(firstName, email, password)
        }
        else{
            var data = await response.json();
            alert(data.text);
            return false;
        }
    
    }
    
 }

 export default AuthService;