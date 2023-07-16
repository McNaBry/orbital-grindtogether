describe("Edit Profile Page", () => {
  it("when account is first created name and email given should appear in profile page", () => {
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
    cy.get('p:contains("brian lee 2660")').should("be.visible")
    cy.get('p:contains("brianlee2660@gmail.com")').should("be.visible")
  })

//   it("when updating should reflect new fields after logging out and logging back in", () => {
//     cy.visit("http://localhost:3000/sign-in")
//     cy.get('input[name="email"]').type(`brianlee2660@gmail.com`)
//     cy.get('input[name="password"]').type("Wgtordlo1!")

//     cy.contains("button", "Login").click()
//     cy.get('[data-testid="create-status-msg"]').should(
//       "have.text",
//       "Sign in successful! Please wait..."
//     )
//     cy.url().should("eq", "http://localhost:3000/dashboard")

//     cy.visit("http://localhost:3000/profile-page")
//     cy.get('[data-testid="telegramHandle"]').within(() => {
//         cy.get('[data-testid="edit-button"]').click();
//     });
//     // cy.get('p:contains("brian lee 2660")').should("be.visible")
//     // cy.get('p:contains("brianlee2660@gmail.com")').should("be.visible")
//   })
})
