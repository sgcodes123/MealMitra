import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );
           localStorage.setItem("token",response.data.token);
           localStorage.setItem("user",JSON.stringify(response.data.user));

            if(response.data.user.role === "admin"){
                navigate("/admin");
            }
            else{
                navigate("/dashboard");
            }
            console.log(response.data);
        }catch(error){
            console.error(error);
            if(error.response){
                alert(error.response.data.message);
            }
            else
            {
                alert("Login Failed");
            }
        }
    }
    return (
        <div className="flex items-center justify-center min-h-[70vh]">
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Login
      </h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Login
        </button>

      </form>

    </div>
  </div>
    )
}
export default Login;