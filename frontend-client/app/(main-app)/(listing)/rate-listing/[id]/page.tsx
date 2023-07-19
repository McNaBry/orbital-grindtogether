import rateStyles from "./rate-listing.module.css"

function Disclaimer() {
  return (
    <p id={rateStyles["disclaimer"]}>
      Note that your rating will be counted only if you have liked the listing.
      <br/>
      If you revoke your like before the 1st day of the listing, your rating will be revoked.
    </p>
  )
}

export default function RateListing({ params } : { params : {id: string} }) {
  return (
    <div id={rateStyles["rate-listing-container"]}>
      <h1 style={{color: "white", textAlign: "center"}}>Rate Listing</h1>
      <Disclaimer />
    </div>
  )
}