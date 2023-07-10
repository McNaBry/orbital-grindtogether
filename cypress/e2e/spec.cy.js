describe("testing the suddenly remember", () => {
  it("should go back to login", () => {
    cy.visit("../../frontend-client/app/(authentication)/input-email-for-reset/page.tsx");
    cy.select(".suddenly-remember").click();
  })
})