    import { useState } from "react";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";

    const Auth = () =>{
        const apiUrl = import.meta.env.VITE_API_URL;
        const [showRegister, setShowRegister] = useState(false);
        const [showLogin, setShowLogin] = useState(true);
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [email, setEmail] = useState("");
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");
        const navigate = useNavigate();
        const handleLogin = async (e = null) =>{
        if(e) e.preventDefault();
            try{
                const response = await axios.post(`${apiUrl}/api/auth/login`,{
                    username: username,
                    password: password
                });

                const { token ,success, message } = response.data;
                if (success){
                    console.log(message);
                    localStorage.setItem('token', token);
                    setUsername("");
                    setPassword("");
                    navigate('/Feeling');

                }else{
                    console.log(message);
                }
                
            }
            catch(error){
                console.log("Error happened while registering " + error);
            }

        }
        const handleRegister = async (e) =>{
            e.preventDefault();
            try{
                const response = await axios.post(`${apiUrl}/api/auth/register`,{
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    password: password
                }
                );
                const { success, message } = response.data;
                if(success){
                    console.log(message);
                    setEmail("");
                    setFirstName("");
                    setLastName("");
                    setUsername("");
                    setPassword("");
                    // handleLogin();
                }
                else{
                    console.log(message);
                }

                
            }
            catch (error){
                console.log("Error Registering " + error);
            }

        }
        return(
            <div className="Home container">
                {/* login form */}
                {showLogin && <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <div className="form-group">
                        <div className="form-control"><input placeholder="username" onChange={(e) => setUsername(e.target.value)} type="text" /></div>
                    </div>
                    <div className="form-group">
                        <div className="form-control"><input placeholder="password" onChange={(e) => setPassword(e.target.value)} type="password" /></div>
                    </div>
                    <button className="btn" type="submit">Submit</button>
                    <button className="btn" onClick={(e) => {setShowRegister(true); setShowLogin(false);}}>
                        Register
                    </button>
                </form>}

                {/* register form */}
                {showRegister && <form onSubmit={handleRegister}>
                    <h2>Register</h2>
                    <div className="form-group">
                        <div className="form-control"><input placeholder="email" onChange={(e) => setEmail(e.target.value)} type="email" /></div>
                    </div>
                    <div className="form-group">
                        <div className="form-control"><input placeholder="first name" onChange={(e) => setFirstName(e.target.value)} type="text" /></div>
                    </div>
                    <div className="form-group">
                        <div className="form-control"><input placeholder="last name" onChange={(e) => setLastName(e.target.value)} type="text" /></div>
                    </div>
                    <div className="form-group">
                        <div className="form-control"><input placeholder="username" onChange={(e) => setUsername(e.target.value)} type="text" /></div>
                    </div>
                    <div className="form-group">
                        <div className="form-control"><input placeholder="password" onChange={(e) => setPassword(e.target.value)} type="text" /></div>
                    </div>
                    
                    <button className="btn" type="submit">Submit</button>
                    <button className="btn" onClick={(e) => {setShowRegister(false); setShowLogin(true);}}>Login</button>
                </form>}
            </div>
            
        )
    }

    export default Auth;