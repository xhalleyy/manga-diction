"use client"

import { IUserData } from "@/Interfaces/Interfaces";
import { getUserInfo } from "@/utils/DataServices";
import { Avatar, Button, Dropdown, DropdownDivider, Modal, Navbar } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DrawerComponent from "./DrawerComponent";
import { useClubContext } from "@/context/ClubContext";
import SearchMangaModalComponent from "./SearchMangaModalComponent";
import NotificationComponent from "./NotificationComponent";

export function NavbarComponent() {

  const info = useClubContext();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>("");
  const [userData, setUserData] = useState<IUserData>();
  const [pageSize, setPageSize] = useState<boolean>(true);


  useEffect(() => {
    let userId = Number(localStorage.getItem("UserId"));
    const fetchedUser = async () => {
        const user = await getUserInfo(userId);
        info.setDisplayedUser(user);
    }
    fetchedUser();

    // handling window resize 
    // typeof returns a string indicating the type of the operand's value
    if (typeof window !== 'undefined') {
      setPageSize(window.innerWidth > 768);

      const handleResize = () => {
        setPageSize(window.innerWidth > 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    
}, []);

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

  const handleSearchModal = () => {
    setOpenModal(true);
  }

  return (
    <Navbar className={pageSize ? "bg-offwhite font-mainFont text-darkbrown !pt-6 !px-8" : 'font-mainFont bg-ivory !pt-6 text-darkbrown drop-shadow-md'} fluid rounded>
      <Navbar.Brand onClick={homePage} className="cursor-pointer">
        <div className="flex items-center sm:grid-cols-3">
          <img className={pageSize ? "w-14 h-14" : "w-10 h-10"} src='./logo.png' alt="Logo" />
          <span style={pageSize ? {fontSize: '30px'} : {fontSize: '27px'}} className={pageSize ? "self-center whitespace-nowrap font-semibold dark:text-white pl-4" : "self-center whitespace-nowrap font-semibold dark:text-white pl-2"}>MangaDiction!</span>
        </div>
      </Navbar.Brand>

      <Navbar.Collapse className="hidden md:hidden lg:flex lg:flex-grow lg:items-center xl:content-end lg:justify-end">
        <Navbar.Link className="text-xl font-bold mr-3 mt-2 text-darkbrown navhover" as={Link} href="BrowseClubs">Browse Clubs</Navbar.Link>
        <Navbar.Link onClick={handleSearchModal} className="text-xl text-darkbrown font-bold mr-3 mt-2 navhover" href="#">Search Manga</Navbar.Link>

        <div className="mt-2">
          <NotificationComponent />
        </div>

        <div className="flex gap-2.5">
          <img src={info.displayedUser?.profilePic || '/noprofile.jpg'} alt="Profile Picture" className="cursor-pointer w-11 h-11 shadow-lg rounded-3xl" onClick={() => router.push('/ProfilePage')} />

          <div className="mt-3">
            <Dropdown className="border-8 border-offwhite rounded-xl w-56"
              arrowIcon={false}
              inline
              label={<img src="/down.png" />}
            >
              <Dropdown.Item className="text-lg flex justify-center text-darkbrown" as={Link} href="ProfilePage">Profile</Dropdown.Item>
              <DropdownDivider className="border-2 border-offwhite" />
              <Dropdown.Item className="text-lg flex justify-center text-darkbrown" onClick={settings}>Edit Settings</Dropdown.Item>
              <DropdownDivider className="border-2 border-offwhite" />
              <Dropdown.Item className="text-lg flex justify-center text-darkbrown" onClick={handleLogout}>Sign Out</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </Navbar.Collapse>

      <div className={pageSize ? "hidden" : "ml-auto"}>
        <DrawerComponent />
      </div>

      <SearchMangaModalComponent open={openModal} setOpen={setOpenModal} />
    </Navbar>
  );
}
