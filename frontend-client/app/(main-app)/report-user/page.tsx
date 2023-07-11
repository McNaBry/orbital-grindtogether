"use client"

import { useState, FormEvent } from "react"
import { Button } from "react-bootstrap"
import DatePicker from "react-datepicker"
import Image from "next/image"
import "react-datepicker/dist/react-datepicker.css"
import styles from "../../(authentication)/auth.module.css"
import "./reportuser.css"

const reportUserIcon = "/images/report-user.png"

function Disclaimer() {
  return (
    <p className="disclaimer">
      {" "}
      All reports made will be manually reviewed by the creators. Any trolls who
      abuse this feature will be banned.{" "}
    </p>
  )
}

function Name() {
  return (
    <>
      <label htmlFor="full-name" className={styles["form-label"]}>
        Name of user
      </label>
      <input
        type="text"
        name="fullName"
        className="form-control"
        id="name"
      ></input>
    </>
  )
}

function DateOfOffence() {
  const [date, setDate] = useState(new Date())

  const handleClick = (date: Date) => {
    setDate(date)
  }

  return (
    <div>
      <label htmlFor="date-picker" className={styles["form-label"]}>
        {" "}
        Date of session where user displayed inappropriate behaviour{" "}
      </label>
      <DatePicker selected={date} onChange={handleClick} name="date" />
    </div>
  )
}

function Reason() {
  return (
    <div className="reason">
      <label htmlFor="reason" className={styles["form-label"]}>
        {" "}
        Reason for reporting particular user{" "}
      </label>
      <textarea rows={5} cols={50} name="reason"></textarea>
    </div>
  )
}

function ReportUserButton() {
  return (
    <Button type="submit" className="mb-3" id="report-user">
      <Image
        width={25}
        height={25}
        src={reportUserIcon}
        style={{ marginRight: "5px" }}
        alt="report-user-icon"
      />
      Report User
    </Button>
  )
}

function ReportUserPage() {
  // bryan please give me a popup when the report was successfully made thanku
  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    try {
      const res = await fetch("http://localhost:5000/report-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingid: "dummy",
          name: formData.get("name"),
          date: formData.get("date"),
          reason: formData.get("reason"),
          reporter: "tj",
        }),
      })

      if (res.ok) {
        console.log("report is successful")
      } else {
        console.log("report unsuccessful")
      }
    } catch (error) {
      console.error("encounter error:", error)
    }
  }

  return (
    <div>
      <Disclaimer />
      <form onSubmit={submitForm}>
        <Name />
        <DateOfOffence />
        <Reason />
        <ReportUserButton />
      </form>
    </div>
  )
}

export default ReportUserPage
