"use client"

import { Avatar, Dropdown, DropdownDivider, Navbar } from "flowbite-react";
import Link from "next/link";

export function NavbarComponent() {


  return (
    <Navbar className="bg-mainBg font-mainFont text-signHeader !pt-6 !px-8 " fluid rounded>
      <Navbar.Brand >
        <Link href="Dashboard" className="flex items-center">
          <img className="w-14 h-14" src='./logo.png' alt="Logo" />
          <span className="self-center whitespace-nowrap text-3xl font-semibold dark:text-white pl-4">MangaDiction!</span>
        </Link>
      </Navbar.Brand>

      <Navbar.Collapse className="ml-auto">
        <Navbar.Link className="text-xl font-bold mr-3 mt-2 text-signHeader" as={Link} href="BrowseClubs">Browse Clubs</Navbar.Link>
        <Navbar.Link className="text-xl text-signHeader font-bold mr-3 mt-2" href="#">Search Manga</Navbar.Link>

        <div className="mt-2">
          <Dropdown className=" border-8 rounded-xl border-mainBg w-96"
            arrowIcon={false}
            inline
            label={
              <img src="/Bell.png" />
            }
          >
            <Dropdown.Item className="text-xl text-signHeader">notification</Dropdown.Item>
            <DropdownDivider className="border-2 border-mainBg" />
            <Dropdown.Item className="text-xl text-signHeader">notification</Dropdown.Item>
            <DropdownDivider className="border-2 border-mainBg" />
            <Dropdown.Item className="text-xl text-signHeader">notification</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>

        <Avatar rounded />

        <div className="mt-3">
          <Dropdown className="border-8 border-mainBg rounded-xl w-56"
            arrowIcon={false}
            inline
            label={
              <img src="/down.png" />
            }
          >

            <Dropdown.Item className="text-lg flex justify-center text-signHeader">Profile</Dropdown.Item>
            <DropdownDivider className="border-2 border-mainBg" />
            <Dropdown.Item className="text-lg flex justify-center text-signHeader"> Edit Settings</Dropdown.Item>
            <DropdownDivider className="border-2 border-mainBg" />
            <Dropdown.Item className="text-lg flex justify-center text-signHeader">Sign Out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>




      </Navbar.Collapse>

    </Navbar>
  );
}
