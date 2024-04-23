"use client"

import { IUserData } from "@/Interfaces/Interfaces";
import { getUserInfo } from "@/utils/DataServices";
import { Avatar, Button, Dropdown, DropdownDivider, Modal, Navbar } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function NavbarComponent() {

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>("");
  const [userData, setUserData] = useState<IUserData>();

  useEffect(() => {
    let userId = Number(localStorage.getItem("UserId"));
        const fetchedUser = async () => {
            const user = await getUserInfo(userId);
            console.log(user.picture)
            const storedPicData = localStorage.getItem(`profilePic_${userId}`);
            if (storedPicData) {
                setProfilePic(storedPicData);
            } setUserData(user);
        }
        fetchedUser();
  }, [])



  const router = useRouter();

  const homePage = () => {
    router.push('/Dashboard');
  }

  const settings = () => {
    router.push('/EditSettings')
  }

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("UserId");
    router.push('/');
  }

  return (
    <Navbar className="bg-offwhite font-mainFont text-darkbrown !pt-6 !px-8 " fluid rounded>
      <Navbar.Brand onClick={homePage} className="cursor-pointer">
        <div className="flex items-center">
          <img className="w-14 h-14" src='./logo.png' alt="Logo" />
          <span className="self-center whitespace-nowrap text-3xl font-semibold dark:text-white pl-4">MangaDiction!</span>
        </div>
      </Navbar.Brand>

      <Navbar.Collapse className="ml-auto">
        <Navbar.Link className="text-xl font-bold mr-3 mt-2 text-darkbrown navhover" as={Link} href="BrowseClubs">Browse Clubs</Navbar.Link>
        <Navbar.Link onClick={() => setOpenModal(true)} className="text-xl text-darkbrown font-bold mr-3 mt-2 navhover" href="#">Search Manga</Navbar.Link>

        <div className="mt-2">
          <Dropdown className=" border-8 rounded-xl border-offwhite w-96"
            arrowIcon={false}
            inline
            label={
              <img src="/Bell.png" />
            }
          >
            <Dropdown.Item className="text-xl text-darkbrown">notification</Dropdown.Item>
            <DropdownDivider className="border-2 border-offwhite" />
            <Dropdown.Item className="text-xl text-darkbrown">notification</Dropdown.Item>
            <DropdownDivider className="border-2 border-offwhite" />
            <Dropdown.Item className="text-xl text-darkbrown">notification</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>

        {/* onClick={() => {router.push('/ProfilePage')} */}
        
        <div className="flex gap-2.5">
        <img src={profilePic || '/dummyImg.png'} alt="Profile Picture" className="cursor-pointer w-10 h-10 rounded-3xl" onClick={() => router.push('/ProfilePage')} />

        <div className="mt-3">
          <Dropdown className="border-8 border-offwhite rounded-xl w-56"
            arrowIcon={false}
            inline
            label={
              <img src="/down.png" />
            }
          >

            <Dropdown.Item className="text-lg flex justify-center text-darkbrown" as={Link} href="ProfilePage">Profile</Dropdown.Item>
            <DropdownDivider className="border-2 border-offwhite" />
            <Dropdown.Item className="text-lg flex justify-center text-darkbrown" onClick={settings}> Edit Settings</Dropdown.Item>
            <DropdownDivider className="border-2 border-offwhite" />
            <Dropdown.Item className="text-lg flex justify-center text-darkbrown" onClick={handleLogout}>Sign Out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>

        </div>





      </Navbar.Collapse>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
                
                <Modal.Body className="darkBeige rounded-lg px-10">
                        <div className="flex justify-end justify-items-end">
                        <button className="text-xl" onClick={() => setOpenModal(false)}>X</button>
                        </div>
                    <div className="pb-5 pt-2 flex flex-1 justify-center">
                        <h1 className="text-center text-3xl font-mainFont font-bold">Find a Manga</h1>
                    </div>
                    <div className="pt-3">
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Search Manga</label>
                            <div>
                                <input className="opaqueWhite rounded-xl w-[50%] h-8" id="titleSearch" />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Author Name</label>
                            <div>
                                <input className="opaqueWhite rounded-xl w-[50%] h-8" />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Tags</label>
                            <div>
                                {/* wider + taller than club name input */}
                                <input className="opaqueWhite rounded-xl w-[100%] h-14" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 pt-5 rounded-xl  ">
                            
                            {/* dropdown, 2 options (public, private) */}
                              <div className="">
                              <select className="rounded-xl w-36 text-sm opaqueWhite font-mainFont h-10  border-none">
                                    <option value="public" className="font-mainFont">Sort By</option>
                                </select>
                              </div>

                              <div className="">
                              <select className="rounded-xl text-sm opaqueWhite font-mainFont h-10 border-none">
                                    <option value="public" className="font-mainFont">Demographics</option>
                                </select>
                              </div>

                              <div>
                              <select className="rounded-xl text-sm opaqueWhite font-mainFont h-10 border-none">
                                    <option value="public" className="font-mainFont">Publication Status</option>
                                </select>
                              </div>
                                                                                  
                            </div>
                    </div>
                    <div className="flex flex-1 justify-end mt-48">
                      <Link href="SearchManga">
                    <Button className="darkBlue rounded-xl" onClick={() => setOpenModal(false)}>
                        <span className="font-mainFont text-lg">Submit</span>
                        {/* <img alt="plus sign" src=""/> */}
                    </Button>
                      </Link>
                    </div>
                </Modal.Body>
               
            </Modal>

    </Navbar>
  );
}
