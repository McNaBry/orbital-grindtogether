import styles from "./auth.module.css"

function Email() {
    return (
      <>
        <label htmlFor="email" className={styles["form-label"]}>
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter your email"
        ></input>
      </>
    );
}

export default Email;