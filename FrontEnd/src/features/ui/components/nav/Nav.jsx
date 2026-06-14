import React, { useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { HiOutlineBars3 } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";

import Button from "../buttons/Button";

import "./nav.scss";

import useAppNavigate from "../../hooks/navigator";
import { useAuth } from "../../../auth/hooks/useAuth";

const Nav = () => {
  const { user, handleLogout, loading } =
    useAuth();

  const goTo = useAppNavigate();

  const [isOpen, setIsOpen] =
    useState(false);

  const scope = useRef();

  const tl = useRef();

  useGSAP(
    () => {
      tl.current = gsap.timeline({
        paused: true,
      });

      tl.current
        .set(".mobile-menu", {
          display: "flex",
        })

        .fromTo(
          ".mobile-menu",
          {
            clipPath:
              "circle(0% at top right)",
          },
          {
            clipPath:
              "circle(150% at top right)",
            duration: 0.8,
            ease: "power4.inOut",
          }
        )

        .from(
          ".mobile-link",
          {
            y: 60,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.4"
        );

      tl.current.eventCallback(
        "onReverseComplete",
        () => {
          gsap.set(".mobile-menu", {
            display: "none",
          });
        }
      );
    },
    { scope }
  );

  const openMenu = () => {
    setIsOpen(true);

    tl.current.play();
  };

  const closeMenu = () => {
    setIsOpen(false);

    tl.current.reverse();
  };

  const closeMenuAndNavigate = (
    path
  ) => {
    if(path === null)return;
    closeMenu();

    setTimeout(() => {
      goTo(path);
    }, 700);
  };

  return (
    <nav ref={scope}>
      {/* LEFT */}
      <div className="nav-left">
        <div className="square"></div>

        <h2 onClick={()=>goTo("/")}>
          Job<span>syte</span>
        </h2>

      </div>

      {/* DESKTOP NAV */}
      <div className="nav-right desktop-nav">
        <div className="nav-links">
          <p  onClick={()=>goTo("/")}>Home</p>

          <p>Features</p>

          <p>Pricing</p>

          <p>
            Skill Roadmap
          </p>

          <p>About</p>

          <p>Contact</p>

        </div>

        <div className="nav-btns">
          {!loading && !user ? (
            <>
              <Button
                text="sign in"
                bg="transparent"
                clickHandler={() =>
                  goTo("/login")
                }
              />

              <Button
                text="Create Account"
                color="#fff"
                clickHandler={() =>
                  goTo("/register")
                }
              />
            </>
          ) : (
            <>
              <FaCircleUser
                size={32}
                style={{
                  cursor: "pointer",
                }}
                onClick={()=>goTo("/dashboard")}
              />

              <Button
                text="Logout"
                color="#fff"
                clickHandler={handleLogout}
              />
            </>
          )}
        </div>
      </div>

      {/* MOBILE HAMBURGER */}
      <div className="hamburger">
        {!isOpen ? (
          <HiOutlineBars3
            size={32}
            onClick={openMenu}
          />
        ) : (
          <IoClose
            size={32}
            onClick={closeMenu}
          />
        )}
      </div>

      {/* MOBILE MENU */}
      <div className="mobile-menu">
        <button
          className="mobile-link"
          onClick={() =>
            closeMenuAndNavigate(
              "/"
            )
          }
        >
          Home
        </button>
        <button
          className="mobile-link"
          onClick={() =>
            closeMenuAndNavigate(
              null
            )
          }
        >
          Features
        </button>

        <button
          className="mobile-link"
          onClick={() =>
            closeMenuAndNavigate(
              null
            )
          }
        >
          Pricing
        </button>

        <button
          className="mobile-link"
          onClick={() =>
            closeMenuAndNavigate(
              null
            )
          }
        >
          Skill Roadmap
        </button>

        <button
          className="mobile-link"
          onClick={() =>
            closeMenuAndNavigate(
              null
            )
          }
        >
          About
        </button>

        <button
          className="mobile-link"
          onClick={() =>
            closeMenuAndNavigate(
              null
            )
          }
        >
          Contact
        </button>

        {!loading && !user ? (
          <div className="mobile-auth">
            <Button
              text="sign in"
              bg="transparent"
              clickHandler={() =>
                closeMenuAndNavigate(
                  "/login"
                )
              }
            />

            <Button
              text="Create Account"
              color="#fff"
              clickHandler={() =>
                closeMenuAndNavigate(
                  "/register"
                )
              }
            />
          </div>
        ) : (
          <div className="mobile-auth">
            <Button
              text="Logout"
              color="#fff"
              clickHandler={() => {
                closeMenu();
                handleLogout();
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;