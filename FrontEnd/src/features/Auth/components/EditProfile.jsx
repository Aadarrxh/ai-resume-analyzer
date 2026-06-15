import React, { useState } from "react";
import Button from "../../ui/components/buttons/Button";
import { RxCrossCircled } from "react-icons/rx";
import { IoShieldOutline } from "react-icons/io5";
import "./styles/editProfile.scss";
import Avatar from "./Avatar";

const EditProfile = () => {
  const [userStacks, setUserStacks] = useState([
    "React",
    "Node",
    "Python",
    "Tailwind Css",
    "MySql",
  ]);

  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const removeStack = (index) => {
    setUserStacks((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewStack = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    const alreadyExists = userStacks.some(
      (stack) => stack.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      alert("Skill already exists!");
      return;
    }

    setUserStacks((prev) => [...prev, skill]);
    setNewSkill("");
    setShowSkillModal(false);
  };

  const acems = [
    {
      heading: "COMPUTER SCIENCE",
      subHeading: "Galgotias University",
      duration: "2015 - 2019",
    },
    {
      heading: "INTER",
      subHeading: "Sf Dav Public School",
      duration: "2014 - 2015",
    },
  ];

  return (
    <section>
      <header className="edit-prof">
        <div className="left">
          <h2>EDIT PROFILE</h2>
          <p>USER_ID: #XP-992-DELTA</p>
        </div>

        <div className="right">
          <Button
            text="Discard"
            bg="#fff"
            color="#000"
            isBorder={true}
            borderValue={0}
          />

          <Button
            text="Save Changes"
            color="#fff"
            isBorder={true}
            borderValue={1}
          />
        </div>
      </header>

      <div className="form-flex">
        <div className="form-box offset-black">
          <div className="profile-pic">
            <Avatar />
          </div>

          <h2>Personal Information</h2>

          <form className="form-edit">
            <div className="upper">
              <div className="upper-left">
                <label htmlFor="name">LEGAL NAME</label>
                <input type="text" placeholder="Enter Name Here" />
              </div>

              <div className="upper-right">
                <label htmlFor="email">EMAIL ADDRESS</label>
                <input type="email" placeholder="Enter Email Here" />
              </div>
            </div>

            <div className="middle">
              <label htmlFor="title">PROFESSIONAL TITLE</label>
              <input type="text" placeholder="Enter Your Role" />
            </div>

            <div className="lower">
              <label htmlFor="bio">TECHNICAL BIO</label>

              <textarea
                name="bio"
                id="txt"
                placeholder="Explain about yourself in brief but not more than 40 words."
                maxLength={50}
                draggable="false"
              />
            </div>
          </form>

          <div className="tech-stack">
            <div className="tech-stack-upper">
              <h2>TECHNICAL STACK</h2>

              <p
                style={{ cursor: "pointer" }}
                onClick={() => setShowSkillModal(true)}
              >
                + add skill
              </p>
            </div>

            <div className="tech-stack-lower">
              {userStacks.map((stack, index) => (
                <p
                  key={index}
                  style={{
                    padding: ".2em",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  <Button
                    text={stack}
                    color="#fff"
                    isBorder={true}
                    borderValue={2}
                  />

                  <RxCrossCircled
                    color="#fff"
                    style={{
                      position: "absolute",
                      top: ".3rem",
                      right: ".3rem",
                      cursor: "pointer",
                    }}
                    onClick={() => removeStack(index)}
                  />
                </p>
              ))}
              {showSkillModal && (
                <div className="skill-overlay">
                  <div className="skill-modal offset-black">
                    <h3>Add New Skill</h3>
        
                    <input
                      type="text"
                      placeholder="Enter skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addNewStack();
                        }
                      }}
                    />
        
                    <div className="btns">
                      <Button
                        text="Cancel"
                        bg="#fff"
                        color="#000"
                        isBorder={true}
                        borderValue={0}
                        clickHandler={() => {
                          setShowSkillModal(false);
                          setNewSkill("");
                        }}
                      />
        
                      <Button
                        text="Add Skill"
                        color="#fff"
                        isBorder={true}
                        borderValue={1}
                        clickHandler={addNewStack}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-settings">
          <div className="card-s offset-black">
            <h2>SECURITY <IoShieldOutline color={"var(--blue)"} size={30}/></h2>
            <p>Ensure your sensitive info remains secret.
              Last Change 24hrs ago.
            </p>
            <div className="btn-div">
              <Button text="UPDATE CREDENTIALS" color="#fff" bg="#000" isBorder={true} borderValue={3} 
              />
            <Button text="TWO_FACTOR AUTH" color="#000" bg="#fff" isBorder={true} borderValue={0}
            />
            </div>
          </div>
          <div className="red-zone">
            <h4>Danger Zone</h4>
            <p>Permanently delete you'r account and all relative scans 
              data and personal info is  irrecoverable.
            </p>
            <Button text="TERMINATE ACCOUNT" isBorder={true} borderValue={4} color="var(--red)"
            bg="#fff"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;