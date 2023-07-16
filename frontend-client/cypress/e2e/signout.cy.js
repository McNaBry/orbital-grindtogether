describe("Sign out", () => {
    it("when clicking on sign out button should return to starter page", () => {
        cy.visit("http://localhost:3000/sign-in")
        cy.get('input[name="email"]').type(`brianlee2660@gmail.com`)
        cy.get('input[name="password"]').type("Wgtordlo1!")

        cy.contains("button", "Login").click()
        cy.get('[data-testid="create-status-msg"]').should(
            "have.text",
            "Sign in successful! Please wait..."
        )
        cy.url().should("eq", "http://localhost:3000/dashboard")

        cy.visit("http://localhost:3000/profile-page")
        cy.contains("button", "Logout").click()
        cy.url().should("eq", "http://localhost:3000/")
    })
})