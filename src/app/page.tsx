'use client'

import { Label, TextInput } from "flowbite-react";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [firstN, setFirstN] = useState<string>("");
  const [lastN, setLastN] = useState<string>("");
  const [age, setAge] = useState<string>("");

  const [logsign, setLogsign] = useState<boolean>(true);

  const logsignSwitch = () => {
    setLogsign(!logsign);
    // remove hidden class from sign up labels + inputs
  }

  return (
    <div>
      <div>
        <h1>{logsign ? "Sign in" : "Sign up"}</h1>

        <form>
          <div>
          <Label htmlFor="username1"  value="Username"/>
          
            <TextInput id="username1" type="text" placeholder="Enter Username" required onChange={(e) => setUsername(e.target.value)}/>
          </div>

          <div className={logsign ? "hidden" : "normale"}>
          <Label htmlFor="firstname1"  value="First Name:"/>
         
            <TextInput id="firstname1" type="text" placeholder="Enter First Name" required onChange={(e) => setFirstN(e.target.value)}/>
          </div>

          <div className={logsign ? "hidden" : "normale"}>
          <Label htmlFor="lastname1"  value="Last Name:"/>
         
            <TextInput id="lastname1" type="text" placeholder="Enter Last Name" required onChange={(e) => setLastN(e.target.value)}/>
          </div>

          <div className={logsign ? "hidden" : "normale"}>
          <Label htmlFor="age1"  value="Age:"/>
        
            <TextInput id="age1" type="text" placeholder="Enter Age" required onChange={(e) => setAge(e.target.value)}/>
          </div>

          <div>
          <Label htmlFor="password1"  value="Password"/>
          
            <TextInput id="password1" type="text" placeholder="Enter Password" required onChange={(e) => setPassword(e.target.value)}/>
          </div>
        </form>

        <button>{logsign ? "Sign in" : "Sign up"}</button>

        <div className="flex">
          <p>{logsign ? "Don't have an account? " : "Already have an account? "}</p>
          <a onClick={logsignSwitch}>{logsign ? "Sign up" : "Sign in"}</a>
        </div>

      </div>
    </div>
  );
}
