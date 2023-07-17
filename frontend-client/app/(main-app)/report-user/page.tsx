"use client"

import { useState, useEffect, FormEvent } from "react"
import { Button } from "react-bootstrap"
import DatePicker from "react-datepicker"
import Image from "next/image"
import { useRouter } from "next/navigation"
import "react-datepicker/dist/react-datepicker.css"
import Notif from "../(listing)/create-listing/notif"
import styles from "../../(authentication)/auth.module.css"
import "./reportuser.css"

const reportUserIcon = "/images/report-user.png"

function ReportUserHeader() {
  return (
    <h2 className = "report-user-header"> Report User Page</h2>
  )
}

function Disclaimer() {
  return (
    <p className="disclaimer">
      {" "}
      All reports made will be manually reviewed by the creators. Any trolls who
      abuse this feature will be banned.{" "}
    </p>
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
  const [success, setSuccess] = useState(false)
  const [msg, setMsg] = useState("")

  const router = useRouter()

  useEffect(() => {
    if (msg != "") {
      const timeout = setTimeout(() => {
        setMsg("")
        if (success) {
          router.push("/dashboard")
        }
      }, 3000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [msg])

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingid: "dummy",
          name: "dummy",
          date: formData.get("date"),
          reason: formData.get("reason"),
        }),
        credentials: "include"
      })

      if (res.ok) {
        setSuccess(true)
        setMsg("Your report was successfully submitted.")
      } else {
        setSuccess(false)
        setMsg("Your report was not successfully submitted.")
      }
    } catch (error) {
      console.error("encounter error:", error)
    }
  }

  return (
    <div>
      <ReportUserHeader />
      <Disclaimer />
      <form onSubmit={submitForm}>
        <DateOfOffence />
        <Reason />
        <ReportUserButton />
        <Notif msg = {msg} success = {success} />
      </form>
    </div>
  )
}

export default ReportUserPage
