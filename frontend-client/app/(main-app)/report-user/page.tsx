"use client"

import { useState, useEffect, FormEvent } from "react"
import { Button, Spinner } from "react-bootstrap"
import Image from "next/image"
import { useRouter } from "next/navigation"
import "react-datepicker/dist/react-datepicker.css"
import Notif from "../(listing)/create-listing/notif"
import DatePicker from "react-datepicker"
import styles from "../../(authentication)/auth.module.css"
import reportStyles from "./report-user.module.css"

const reportUserIcon = "/images/report-user.png"

function ReportUserHeader() {
  return (
    <h2 className={reportStyles["report-user-header"]}> Report User </h2>
  )
}

function Disclaimer() {
  return (
    <p className={reportStyles["disclaimer"]}>
      {" "}
      All reports made will be manually reviewed by the creators. 
      <br></br>
      Any trolls who abuse this feature will be banned.{" "}
    </p>
  )
}

function ReportDetails({ name } : { name: string }) {
  return (
    <div id={reportStyles["report-details"]}>
      <p>You are reporting: {name}</p>
    </div>
  )
}

function DateOfOffence() {
  const [date, setDate] = useState(new Date())

  const handleClick = (date: Date) => setDate(date)

  return (
    <div>
      <label htmlFor="date" className={styles["form-label"]}>
        {" "}
        Date of session where user displayed inappropriate behaviour{" "}
      </label>
      <DatePicker selected={date} onChange={handleClick} name="date" />
    </div>
  )
}

function Reason() {
  return (
    <div className={reportStyles["reason"]}>
      <label htmlFor="reason" className={styles["form-label"]}>
        {" "}
        Reason for reporting particular user{" "}
      </label>
      <textarea rows={5} name="reason" id={reportStyles["reason-input"]}></textarea>
    </div>
  )
}

function ReportUserButton({ isLoading } : { isLoading: boolean }) {
  return (
    <Button disabled={isLoading} type="submit" className="mb-3" id={reportStyles["report-user"]}>
      { isLoading
        ? <Spinner
            style={{marginRight: "5px"}}
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        : <Image
          width={25}
          height={25}
          src={reportUserIcon}
          style={{ marginRight: "5px" }}
          alt="report-user-icon"
        /> 
      }
      { isLoading ? "Reporting..." : "Report User" }
    </Button>
  )
}

type expectedParams = {
  name: string,
  userID: string,
  listingUID: string
}

function ReportUserPage({ searchParams } : { searchParams: any }) {
  const urlParams = new URLSearchParams(searchParams)
  const [success, setSuccess] = useState<boolean>(false)
  const [msg, setMsg] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

    const reason = formData.get("reason")
    if (reason == "" || reason == null) {
      setSuccess(false)
      setMsg("Please provide a reason")
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingUID: urlParams.get("listingUID") || "None specified",
          reportedName: urlParams.get("name") || "None specified",
          reportedUID: urlParams.get("userID") || "None specified",
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
      setIsLoading(false)
    } catch (error) {
      console.error("Encounter error:", error)
    }
  }

  return (
    <div id={reportStyles["report-user-container"]}>
      <ReportUserHeader />
      <Disclaimer />
      <ReportDetails 
        name={urlParams.get("name") || ""} 
       />
      <form onSubmit={submitForm}>
        <DateOfOffence />
        <Reason />
        <ReportUserButton isLoading={isLoading} />
      </form>
      <Notif msg={msg} success={success} />
    </div>
  )
}

export default ReportUserPage
