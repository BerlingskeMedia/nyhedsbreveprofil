context('Signup to newsletter', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })
  })

  it('should signup to newsletter', () => {
    cy.visit('/nyhedsbreve')
      .get('.newsletters').contains('test newsletter')
      .get('.newsletters').contains('test newsletter 2');
    cy.contains('test newsletter').closest('li').find('label').first().click();
    cy.contains('NÆSTE').click();

    cy.url().should('include', '/opret/profil')
      .get('input[name="email"]').type('test@bdk.dk')
      .get('input[name="firstName"]').type('Test')
      .get('input[name="lastname"]').type('Tester')
      .get('input[name="zip"]').type('1112')
      .get('input[name="birthyear"]').type('1990');
    cy.contains('Servicemails Berlingske').click();
    cy.contains('TILMELD').click();

    cy.url().should('include', '/opret/interesser');
    cy.contains('Vælg dine interesser');
    cy.contains(' Interest 1').click()
      .get('.letter-list li').should('have.length', 1)
      .get('.letter-list li').contains('test newsletter');
    cy.contains('Gem').click();

    cy.url().should('include', '/tak');
    cy.contains('Tak for din interesse');
  })
})
