'use client'

import { IToken } from "@/Interfaces/Interfaces";
import { createUser, login } from "@/utils/DataServices";
import { log } from "console";
import { create } from "domain";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [firstN, setFirstN] = useState<string>("");
  const [lastN, setLastN] = useState<string>("");
  const [age, setAge] = useState<string>("");

  const [logsign, setLogsign] = useState<boolean>(true);
  const router = useRouter();

  const logsignSwitch = () => {
    setLogsign(!logsign);
    // remove hidden class from sign up labels + inputs
  }

  const handleSignUp = async () => {

    let userData = {
      id: 0,
      username: username,
      firstName: firstN,
      lastName: lastN,
      age: 0,
      password: password
    }

    if (logsign) {

      createUser(userData);

    } else {


      let token: IToken = await login(userData);
      console.log(token);

      if(token.token != null){

        localStorage.setItem("Token", token.token);
        alert("user created! go to login.")

      } else {
        
        alert('login failed! </3')

      }
    }
  }

  const handleLogIn = async () => {

    let loginData = {
      username: username,
      password: password
    }

    if(logsign){

      login(loginData);

    } else {

      let token: IToken = await login(loginData);
      console.log(token);

      if(token.token != null){

        localStorage.setItem("Token", token.token);
        router.push('/Dashboard')

      } else {
        
        alert('login failed! </3')

      }
    }
    }



  return (
    <div className="flex">
      <div className="bg-bgLogin w-screen h-screen bg-cover bg-center flex flex-col flex-1">

        <div className="mt-20 ml-24">
          <img className="w-32" src="/logo.png" />
        </div>

        <div className="ml-24 mt-5">
          <h1 className="font-mainFont font-extrabold text-6xl text-white">Manga Diction!</h1>
        </div>

        <div className="ml-24 mt-5 w-3/5">
          <p className="font-mainFont text-white text-2xl">Create or join clubs to regularly interact with your communities about anything Manga related.</p>
        </div>

      </div>

      <div className={logsign ? "flex flex-col flex-1 mt-44 font-mainFont" : "flex flex-col flex-1 pt-5 font-mainFont"}>

        <div className="p-20 w-11/12">

          <div className={logsign ? 'font-bold text-3xl text-signHeader mb-10' : 'font-bold text-3xl text-signHeader2 mb-10'}>
            <h1>{logsign ? "Sign in" : "Sign up"}</h1>
          </div>

          <form>
            <div className="mb-3">
              <Label className={logsign ? 'text-signHeader' : 'text-signUp'} htmlFor="username1" value="Username" />

              <TextInput id="username1" type="text" placeholder="Enter Username" required onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className={logsign ? "hidden mb-3 " : "normale mb-3"}>
              <Label className="text-signUp" htmlFor="firstname1" value="First Name:" />

              <TextInput id="firstname1" type="text" placeholder="Enter First Name" required onChange={(e) => setFirstN(e.target.value)} />
            </div>

            <div className={logsign ? "hidden mb-3" : "normale mb-3"}>
              <Label className="text-signUp" htmlFor="lastname1" value="Last Name:" />

              <TextInput id="lastname1" type="text" placeholder="Enter Last Name" required onChange={(e) => setLastN(e.target.value)} />
            </div>

            <div className={logsign ? "hidden mb-3" : "normale mb-3"}>
              <Label className="text-signUp" htmlFor="age1" value="Age:" />

              <TextInput id="age1" type="text" placeholder="Enter Age" required onChange={(e) => setAge(e.target.value)} />
            </div>

            <div className="mb-3">
              <Label className={logsign ? 'text-signHeader' : 'text-signUp'} htmlFor="password1" value="Password" />

              <TextInput id="password1" type="text" placeholder="Enter Password" required onChange={(e) => setPassword(e.target.value)} />
            </div>
          </form>

          <button onClick={logsign ? handleSignUp : handleLogIn} className={logsign ? "bg-signHeader p-3 text-white pl-24 pr-24 rounded-3xl font-thin mt-10" : "bg-signUpBtn p-3 text-white pl-24 pr-24 rounded-3xl font-thin mt-10 mb-3"}>{logsign ? "Sign in" : "Sign up"}</button>


          <div className="flex">
            
            <button>
              <a className={logsign ? 'text-signHeader' : 'text-signUp'} onClick={logsignSwitch}>
                {logsign ? "Don't have an account? " : "Already have an account? "}
                <span className="underline">Sign {logsign ? "up" : "in"}</span>
              </a>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
