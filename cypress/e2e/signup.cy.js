describe("Sign up", () => {
  it("should be successful when the signup form is filled in correctly and submitted", () => {
    cy.visit("http://localhost:3000/sign-up")

    const randomNumber = Math.floor(Math.random() * 1000000)
    cy.get('input[name="fullName"').type(`brian lee ${randomNumber}`)
    cy.get('input[name="email"]').type(`brianlee${randomNumber}@gmail.com`)
    cy.get('input[name="password"]').type("Wgtordlo1!")
    cy.get('input[name="confirmPw"]').type("Wgtordlo1!")

    cy.contains("button", "Create Account").click()

    cy.get('[data-testid="create-status-msg"]').should(
      "have.text",
      "Account has been successfully created!"
    )
    cy.url({ timeout: 2000 }).should("eq", "http://localhost:3000/sign-in")
  })

  it("should be unsuccessful when the passwords don't match", () => {
    cy.visit("http://localhost:3000/sign-up")

    cy.get('input[name="fullName"').type(`brian lee`)
    cy.get('input[name="email"]').type(`brianlee@gmail.com`)
    cy.get('input[name="password"]').type("Wgtordlo1!")
    cy.get('input[name="confirmPw"]').type("Wgtordlo1")

    cy.contains("button", "Create Account").click()
    cy.get('[data-testid="create-status-msg"]').should(
      "have.text",
      "Passwords entered do not match."
    )
  })

  it("should be unsuccessful when the password is not long enough", () => {
    cy.visit("http://localhost:3000/sign-up")

    cy.get('input[name="fullName"').type(`brian lee`)
    cy.get('input[name="email"]').type(`brianlee@gmail.com`)
    cy.get('input[name="password"]').type("yay")
    cy.get('input[name="confirmPw"]').type("yay")

    cy.contains("button", "Create Account").click()
    cy.get('[data-testid="create-status-msg"]').should(
      "have.text",
      "Password should be at least 8 characters long."
    )
  })

  it("should be unsuccessful when the password has no capital letters", () => {
    cy.visit("http://localhost:3000/sign-up")

    cy.get('input[name="fullName"').type(`brian lee`)
    cy.get('input[name="email"]').type(`brianlee@gmail.com`)
    cy.get('input[name="password"]').type("yayayaya")
    cy.get('input[name="confirmPw"]').type("yayayaya")

    cy.contains("button", "Create Account").click()
    cy.get('[data-testid="create-status-msg"]').should(
      "have.text",
      "Password should at least have one capital letter."
    )
  })

  it("should be unsuccessful when the password has no lowercase letters", () => {
    cy.visit("http://localhost:3000/sign-up")

    cy.get('input[name="fullName"').type(`brian lee`)
    cy.get('input[name="email"]').type(`brianlee@gmail.com`)
    cy.get('input[name="password"]').type("YAYAYAYA")
    cy.get('input[name="confirmPw"]').type("YAYAYAYA")

    cy.contains("button", "Create Account").click()
    cy.get('[data-testid="create-status-msg"]').should(
      "have.text",
      "Password should at least have one lowercase letter."
    )
  })

  it("should be unsuccessful when the password has no number", () => {
    cy.visit("http://localhost:3000/sign-up")

    cy.get('input[name="fullName"').type(`brian lee`)
    cy.get('input[name="email"]').type(`brianlee@gmail.com`)
    cy.get('input[name="password"]').type("Helloworld")
    cy.get('input[name="confirmPw"]').type("Helloworld")

    cy.contains("button", "Create Account").click()
    cy.get('[data-testid="create-status-msg"]').should(
      "have.text",
      "Password should at least have one number."
    )
  })

  it("should be unsuccessful when the password has no special characters", () => {
    cy.visit("http://localhost:3000/sign-up")

    cy.get('input[name="fullName"').type(`brian lee`)
    cy.get('input[name="email"]').type(`brianlee@gmail.com`)
    cy.get('input[name="password"]').type("Helloworld1")
    cy.get('input[name="confirmPw"]').type("Helloworld1")

    cy.contains("button", "Create Account").click()
    cy.get('[data-testid="create-status-msg"]').should(
      "have.text",
      "Password should at least have one special character."
    )
  })
})
