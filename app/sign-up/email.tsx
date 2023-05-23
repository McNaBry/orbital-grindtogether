function Email() {
    return (
      <>
        <label htmlFor="email" className="form-label">
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