'use client'

import { IToken } from "@/Interfaces/Interfaces";
import { createUser, login } from "@/utils/DataServices";
import { log } from "console";
import { create } from "domain";
import { Button, Label, TextInput, CustomFlowbiteTheme } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function Home() {

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [id, setId] = useState<number>(0);
  const [firstN, setFirstN] = useState<string>("");
  const [lastN, setLastN] = useState<string>("");
  const [age, setAge] = useState<number>(0);

  const [logsign, setLogsign] = useState<boolean>(true);

  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [visibility, setVisibility] = useState<boolean>(false);

  const router = useRouter();

  const logsignSwitch = () => {
    setLogsign(!logsign);
    // remove hidden class from sign up labels + inputs
  }

  const handleSignUp = async () => {

    let userData = {
      id: id,
      username: username,
      firstName: firstN,
      lastName: lastN,
      age: age,
      password: password
    }


    let loginData = {
      username: username,
      password: password
    }

    console.log(userData);

    // if you're loggin in then this codeblock:
    if (logsign) {

      let token: IToken = await login(loginData);
      console.log(token);

      if (token.token != null) {

        localStorage.setItem("Token", token.token);
        router.push('/Dashboard')

      } else {

        alert('Signup failed! </3')

      }

    } else {
      // ELSE you're signing up so 
      try {
        await createUser(userData);
        // Reset 
        setSuccess(true);
        setLogsign(true);
        setUsername("");
        setPassword("");
        setId(0);
        setFirstN("");
        setLastN("");
        setAge(0);

      } catch (error) {
        setLogsign(true);
        setSuccess(false)
        // Reset 
        // setSuccess(false);
      }
    }
  }

  const handlePasswordVisibility = () => {
    setVisibility(!visibility);
  }

  const customInput: CustomFlowbiteTheme['textInput'] = {
    "field":{
      "input": {
        "colors": {
          "brown": "border-gray-300 bg-gray-50 text-darkbrown focus:border-lightbrown focus:ring-lightbrown"
        },
      },
    }
  }

  return (
    <>
      <div className="hidden md:flex min-h-screen bg-bgLogin">
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
        <div className={logsign ? "flex flex-col flex-1 mt-36 font-mainFont" : "flex flex-col flex-1 pt-5 font-mainFont"}>
          <div className="w-full flex justify-end items-end -mt-[90px]">
            {success && (
              <div className="w-72">
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Account created successfully!
                </Alert>
              </div>
            )}
          </div>

          <div className={logsign ? "p-20" : "px-20 mt-40"}>

            <div className={logsign ? 'font-bold text-3xl text-darkbrown mb-10' : ' font-bold text-3xl text-darkgray mb-10'}>
              <h1>{logsign ? "Sign in" : "Sign up"}</h1>
            </div>

            <form>
              <div className="mb-3">
                <Label className={logsign ? 'text-darkbrown' : 'text-signUp'} htmlFor="username1" value="Username" />

                <TextInput value={username} theme={customInput} color="brown" id="username1" type="text" placeholder="Enter Username" required onChange={(e) => setUsername(e.target.value)} />
              </div>

              <div className={logsign ? "hidden mb-3 " : "normale mb-3"}>
                <Label className="text-signUp" htmlFor="firstname1" value="First Name:" />

                <TextInput theme={customInput} color="brown" id="firstname1" type="text" placeholder="Enter First Name" required onChange={(e) => setFirstN(e.target.value)} />
              </div>

              <div className={logsign ? "hidden mb-3" : "normale mb-3"}>
                <Label className="text-signUp" htmlFor="lastname1" value="Last Name:" />

                <TextInput theme={customInput} color="brown" id="lastname1" type="text" placeholder="Enter Last Name" required onChange={(e) => setLastN(e.target.value)} />
              </div>

              <div className={logsign ? "hidden mb-3" : "normale mb-3"}>
                <Label className="text-signUp" htmlFor="age1" value="Age:" />

                <TextInput theme={customInput} color="brown" id="age1" type="text" placeholder="Enter Age" required onChange={(e) => setAge(Number(e.target.value))} />
              </div>

              <div className="mb-3 flex flex-col">
                <div className="flex flex-row place-content-between">
                  <Label className={logsign ? 'text-darkbrown' : 'text-signUp'} htmlFor="password1" value="Password" />
                  <div onClick={handlePasswordVisibility} className="text-sm text-signUp cursor-pointer">
                    {visibility ? (
                      <>
                        <VisibilityOffIcon fontSize="small" className="me-1" />
                        Hide Password
                      </>
                    ) : (
                      <>
                        <RemoveRedEyeIcon fontSize="small" className="me-1" />
                        Show Password
                      </>
                    )}
                  </div>
                </div>

                <TextInput value={password} theme={customInput} color="brown" id="password1" type={visibility ? 'text' : 'password'} placeholder="Enter Password" required onChange={(e) => setPassword(e.target.value)} />
              </div>
            </form>

            <button onClick={handleSignUp} className={logsign ? "bg-darkbrown p-3 text-white pl-24 pr-24 rounded-3xl font-thin mt-10" : "bg-lightbrown p-3 text-white pl-24 pr-24 rounded-3xl font-thin mt-5 mb-3"}>{logsign ? "Sign in" : "Sign up"}</button>


            <div className="flex pt-1.5 ps-3 ">

              <button>
                <a className={logsign ? 'text-darkbrown' : 'text-signUp'} onClick={logsignSwitch}>
                  {logsign ? "Don't have an account? " : "Already have an account? "}
                  <span className="underline">Sign {logsign ? "up" : "in"}</span>
                </a>
              </button>

              <div>
              </div>

            </div>

          </div>
        </div>
      </div>


      <div className="flex flex-col md:hidden mobileBg min-h-screen w-auto">
        <div className="flex flex-col gap-2 justify-center items-center pt-24">
          <img className="w-20" src="/logo.png" />
          <h1 className="text-4xl font-mainFont text-darkbrown font-bold">MangaDiction!</h1>
        </div>

        <div className="flex flex-row gap-5 justify-center">
          <Tabs value={value} onChange={handleChange} className="!font-mainFont !text-2xl" aria-label="disabled tabs example">
            <Tab label="Active" />
            <Tab label="Disabled" disabled />
          </Tabs>
        </div>
      </div>
    </>


  );
}

