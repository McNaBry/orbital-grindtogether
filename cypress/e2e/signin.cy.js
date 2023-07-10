describe("Sign in", () => {
    it("should be unsuccessful if an account wasn't created yet", () => {
        cy.visit("http://localhost:3000/sign-in")
        cy.get('input[name="email"]').type(`testing@gmail.com`)
        cy.get('input[name="password"]').type("Helloworld1!")

        cy.contains("button", "Login").click()
        cy.get('[data-testid="create-status-msg"]').should(
            "have.text",
            "Cannot login. Please try again later."
        )
    })

    it("should be unsuccessful if password was not keyed in correctly", () => {
        cy.visit("http://localhost:3000/sign-in")
        cy.get('input[name="email"]').type("gavin@gmail.com")
        cy.get('input[name="password"]').type("Wgtordlo1!")

        cy.contains("button", "Login").click()
        cy.get('[data-testid="create-status-msg"]').should(
            "have.text",
            "Cannot login. Please try again later."
        )
    })

    it("should be successful if email and password was keyed in correctly", () => {
        cy.visit("http://localhost:3000/sign-in")
        cy.get('input[name="email"]').type(`brianlee2660@gmail.com`)
        cy.get('input[name="password"]').type("Wgtordlo1!")

        cy.contains("button", "Login").click()
        cy.get('[data-testid="create-status-msg"]').should(
            "have.text",
            "Sign in successful! Please wait..."
        )
    })
})