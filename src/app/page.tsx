'use client'

import { IToken } from "@/Interfaces/Interfaces";
import { createUser, login, searchManga } from "@/utils/DataServices";
import { log, profile } from "console";
import { create } from "domain";
import { Button, Label, TextInput, CustomFlowbiteTheme } from "flowbite-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Planet } from "react-kawaii";


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
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [logsign, setLogsign] = useState<boolean>(true);
  const [loginFail, setLoginFail] = useState<boolean | undefined>(false);
  const [required, setRequired] = useState<boolean | undefined>(false);

  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [visibility, setVisibility] = useState<boolean>(false);

  const router = useRouter();

  const logsignSwitch = () => {
    setLogsign(!logsign);
    // remove hidden class from sign up labels + inputs
  }

  const handleSignUp = async () => {

    if (!username || !password || (!logsign && (!firstN || !lastN || age === 0))) {
      setRequired(true);
      setTimeout(() => {
        setRequired(undefined);
      }, 5000);
      return;
    }

    let userData = {
      id: id,
      username: username,
      firstName: firstN,
      lastName: lastN,
      age: age,
      password: password,
      profilePic: profilePic
    }


    let loginData = {
      username: username,
      password: password
    }

    console.log(userData);

    // if you're loggin in then this codeblock:
    if (logsign) {
      try {
        let token: IToken = await login(loginData);
        console.log('Token received:', token);

        if (token.token != null) {
          setId(token.userId);
          localStorage.setItem("Token", token.token);
          localStorage.setItem("UserId", token.userId.toLocaleString());
          router.push('/Dashboard');
          // console.log('Username:', username);
        } else {
          alert('Signup failed! </3');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginFail(true);
        setTimeout(() => {
          setLoginFail(undefined);
        }, 5000);
      }
    } else {
      // ELSE you're signing up so 
      try {
        await createUser(userData);
        // Reset 
        setSuccess(true);
        setTimeout(() => {
          setSuccess(undefined);
        }, 5000);
        setLogsign(true);
        setUsername("");
        setPassword("");
        setId(0);
        setFirstN("");
        setLastN("");
        setProfilePic(null);
        setAge(0);
        setLoginFail(false);

      } catch (error) {
        setLogsign(true);
        setSuccess(false)
        // setSuccess(false);
      }
    }
  }


  const handlePasswordVisibility = () => {
    setVisibility(!visibility);
  }

  const customInput: CustomFlowbiteTheme['textInput'] = {
    "field": {
      "input": {
        "colors": {
          "brown": "border-gray-300 bg-gray-50 text-darkbrown focus:border-lightbrown focus:ring-lightbrown"
        },
      },
    }
  }

  return (
    <>
      <div className="hidden md:flex  ">
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
                <Alert className='rounded-xl bg-paleblue' icon={<Planet size={30} mood="happy" color="#FCCB7E" />} severity="success">
                  Account successfully created!
                </Alert>
              </div>
            )}
          </div>

          <div className={logsign ? "p-20" : "px-20 mt-40"}>

            <div className={logsign ? 'font-bold text-3xl text-darkbrown mb-10' : ' font-bold text-3xl text-darkgray mb-10'}>
              <h1>{logsign ? "Sign in" : "Sign up"}</h1>
            </div>

            {loginFail && logsign ?
              <p className="text-red-900"> Incorrect username or password. Try again!</p> :
              null}

            {required && !logsign ?
              <p className="text-red-900"> Please fill out all fields to create an account. </p>
              : null
            }

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
            <Tab label="Login" onClick={logsignSwitch} className="tabActive" />
            <Tab label="Register" onClick={logsignSwitch} className="tabActive" />
          </Tabs>
        </div>

        <div className="mx-auto mt-10 w-[80%]">
          {loginFail && logsign ?
            <p className="text-red-900 text-center"> Incorrect username or password. Try again!</p> :
            null}

          {required && !logsign ?
            <p className="text-red-900 text-center"> Please fill out all fields to create an account. </p>
            : null
          }
          <form>
            <div className=" my-5">
              <input className="mobileInputUser" placeholder="Username" id="username2" required onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className={logsign ? "hidden" : "my-7 "}>
              <input className="mobileInputUser" placeholder="First Name" id="firstname2" required onChange={(e) => setFirstN(e.target.value)} />
            </div>
            <div className={logsign ? "hidden" : "my-7 "}>
              <input className="mobileInputUser" placeholder="Last Name" id="lastname2" required onChange={(e) => setLastN(e.target.value)} />
            </div>
            <div className={logsign ? "hidden" : "my-7 "}>
              <input className="mobileInputUser" placeholder="Age" id="age2" required onChange={(e) => setAge(Number(e.target.value))} />
            </div>

            <div className={logsign ? "grid grid-cols-8 mt-10" : "grid grid-cols-8"}>
              <input className="mobileInputPass col-span-7" placeholder="Password" id="password2" required onChange={(e) => setPassword(e.target.value)} />

              <div onClick={handlePasswordVisibility} className=" col-span-1 justify-end text-sm text-signUp cursor-pointer border-b border-gray-400">
                {visibility ? (
                  <>
                    <VisibilityOffIcon fontSize="small" className="me-1" />
                  </>
                ) : (
                  <>
                    <RemoveRedEyeIcon fontSize="small" className="me-1" />
                  </>
                )}
              </div>
            </div>
            <div>
              {/* remember password? buttons */}
            </div>
            <button onClick={handleSignUp} className=" h-12 w-full mt-14 text-3xl text-white darkBeige rounded-md font-mainFont">{logsign ? 'Sign In' : 'Sign Up'}</button>
          </form>
        </div>
      </div>


    </>


  );
}

